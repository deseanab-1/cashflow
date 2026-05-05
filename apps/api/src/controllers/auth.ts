import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REFRESH_COOKIE_NAME = "refreshToken";

function accessTokenTtlSeconds(): number {
  const n = Number(process.env.ACCESS_TOKEN_TTL_SECONDS ?? 900);
  return Number.isFinite(n) && n > 0 ? n : 900;
}

function refreshTokenTtlDays(): number {
  const n = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30);
  return Number.isFinite(n) && n > 0 ? n : 30;
}

function signAccessToken(user: { id: string; email: string }) {
  const jwtSecret = process.env.JWT_ACCESS_SECRET;
  if (!jwtSecret) throw new Error("JWT_ACCESS_SECRET is not set");

  return jwt.sign(
    { sub: user.id, email: user.email },
    jwtSecret,
    {
      expiresIn: accessTokenTtlSeconds(),
      issuer: "cashflow-api",
      audience: "cashflow-web",
    },
  );
}

function signRefreshToken(userId: string, jti: string) {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");

  return jwt.sign(
    { sub: userId, jti, typ: "refresh" },
    secret,
    {
      expiresIn: `${refreshTokenTtlDays()}d`,
      issuer: "cashflow-api",
      audience: "cashflow-web",
    },
  );
}

function cookieBaseOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? ("none" as const) : ("lax" as const),
    path: "/",
  };
}

function setRefreshCookie(res: Parameters<RequestHandler>[1], refreshToken: string) {
  const maxAge = refreshTokenTtlDays() * 24 * 60 * 60 * 1000;
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...cookieBaseOptions(),
    maxAge,
  });
}

function clearRefreshCookie(res: Parameters<RequestHandler>[1]) {
  res.clearCookie(REFRESH_COOKIE_NAME, cookieBaseOptions());
}

function readRefreshTokenFromRequest(req: Parameters<RequestHandler>[0]): string | undefined {
  if (typeof req.cookies?.[REFRESH_COOKIE_NAME] === "string") {
    return req.cookies[REFRESH_COOKIE_NAME];
  }
  if (typeof req.body?.refreshToken === "string") {
    return req.body.refreshToken;
  }
  return undefined;
}

export const register: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email)) return res.status(422).json({ message: "Invalid email format" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Registration failed" });
  }

  return res.status(201).json({ message: "User registered successfully" });
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email)) return res.status(422).json({ message: "Invalid email format" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "No user with email found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const jti = crypto.randomUUID();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokens: { push: jti },
      },
    });

    const refreshToken = signRefreshToken(user.id, jti);
    setRefreshCookie(res, refreshToken);

    const token = signAccessToken(user);

    return res.json({
      token,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Login failed" });
  }
};

export const refresh: RequestHandler = async (req, res) => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");

    const refreshToken = readRefreshTokenFromRequest(req);

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    let decoded: jwt.JwtPayload;
    try {
      decoded = jwt.verify(refreshToken, secret, {
        issuer: "cashflow-api",
        audience: "cashflow-web",
      }) as jwt.JwtPayload;
    } catch {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    if (decoded.typ !== "refresh" || typeof decoded.sub !== "string" || typeof decoded.jti !== "string") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user || !user.refreshTokens.includes(decoded.jti)) {
      return res.status(401).json({ message: "Refresh token revoked or unknown" });
    }

    const newJti = crypto.randomUUID();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokens: user.refreshTokens.filter((t) => t !== decoded.jti).concat(newJti),
      },
    });

    const nextRefresh = signRefreshToken(user.id, newJti);
    setRefreshCookie(res, nextRefresh);

    const token = signAccessToken(user);

    return res.json({
      token,
      refreshToken: nextRefresh,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Refresh failed" });
  }
};

/** Revokes the current refresh session server-side and clears the cookie. Drop the access token on the client. */
export const logout: RequestHandler = async (req, res) => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET;
    const refreshToken = readRefreshTokenFromRequest(req);

    clearRefreshCookie(res);

    if (!refreshToken || !secret) {
      return res.status(204).send();
    }

    try {
      const decoded = jwt.verify(refreshToken, secret, {
        issuer: "cashflow-api",
        audience: "cashflow-web",
      }) as jwt.JwtPayload;

      if (
        decoded.typ === "refresh" &&
        typeof decoded.sub === "string" &&
        typeof decoded.jti === "string"
      ) {
        const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
        if (user?.refreshTokens.includes(decoded.jti)) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              refreshTokens: user.refreshTokens.filter((t) => t !== decoded.jti),
            },
          });
        }
      }
    } catch {
      // Expired or bogus token — cookie already cleared; nothing to revoke in DB.
    }

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    clearRefreshCookie(res);
    return res.status(500).json({ message: "Logout failed" });
  }
};

function validateEmail(email: string): boolean {
  return emailRegex.test(email);
}
