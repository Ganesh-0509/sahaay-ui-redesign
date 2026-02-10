import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./authMiddleware.js";

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.isAdmin) {
    return res.status(403).send("Forbidden");
  }
  return next();
};
