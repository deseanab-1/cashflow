import type { RequestHandler } from "express";

export const notImplemented = (feature: string): RequestHandler =>
  (_req, res) => {
    res.status(501).json({
      ok: false,
      error: "not_implemented",
      feature,
    });
  };

