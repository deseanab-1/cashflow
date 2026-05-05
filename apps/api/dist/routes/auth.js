import { Router } from "express";
import { notImplemented } from "./_notImplemented.js";
export const authRouter = Router();
authRouter.post("/register", notImplemented("auth.register"));
authRouter.post("/login", notImplemented("auth.login"));
authRouter.post("/refresh", notImplemented("auth.refresh"));
authRouter.post("/logout", notImplemented("auth.logout"));
