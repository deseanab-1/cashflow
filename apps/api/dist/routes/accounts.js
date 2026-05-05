import { Router } from "express";
import { notImplemented } from "./_notImplemented.js";
export const accountsRouter = Router();
accountsRouter.get("/", notImplemented("accounts.list"));
accountsRouter.post("/", notImplemented("accounts.create"));
accountsRouter.put("/:id", notImplemented("accounts.update"));
accountsRouter.delete("/:id", notImplemented("accounts.delete"));
