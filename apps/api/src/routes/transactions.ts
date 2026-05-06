import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { create, list } from "../controllers/transaction";
import { notImplemented } from "./_notImplemented";

export const transactionsRouter = Router();

transactionsRouter.get("/", authenticate, list);
transactionsRouter.post("/", authenticate, create);
transactionsRouter.put("/:id", notImplemented("transactions.update"));
transactionsRouter.delete("/:id", notImplemented("transactions.delete"));

