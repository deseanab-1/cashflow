import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { create, deleteTransaction, list, update } from "../controllers/transaction";
import { notImplemented } from "./_notImplemented";

export const transactionsRouter = Router();

transactionsRouter.get("/", authenticate, list);
transactionsRouter.post("/", authenticate, create);
transactionsRouter.put("/:id", authenticate, update);
transactionsRouter.delete("/:id", authenticate, deleteTransaction);

