import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Invalid Token" });
  }
};