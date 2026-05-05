import { Router } from "express";
import { notImplemented } from "./_notImplemented.js";

export const transactionsRouter = Router();

transactionsRouter.get("/", notImplemented("transactions.list"));
transactionsRouter.post("/", notImplemented("transactions.create"));
transactionsRouter.put("/:id", notImplemented("transactions.update"));
transactionsRouter.delete("/:id", notImplemented("transactions.delete"));

