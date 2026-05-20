import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { list, create, update, deleteAccount, getTransaction } from "../controllers/account.js";
import {
  create as createTransaction,
  update as updateTransaction,
  deleteTransaction
} from "../controllers/transaction.js";


export const accountsRouter = Router();

accountsRouter.get("/", authenticate, list);
accountsRouter.post("/", authenticate, create);
accountsRouter.put("/:id", authenticate, update);
accountsRouter.delete("/:id", authenticate, deleteAccount);
accountsRouter.get("/:id/transactions/:transactionId", authenticate, getTransaction);

// Transactions

accountsRouter.post(
  "/:id/transactions",
  authenticate,
  (req, res, next) => {
    req.body.accountId = req.params.id;
    next();
  }, createTransaction);

accountsRouter.put(
  "/:id/transactions/:transactionId",
  authenticate,
  (req, res, next) => {
    req.body.accountId = req.params.id;
    next();
  }, updateTransaction);

accountsRouter.delete(
  "/:id/transactions",
  authenticate,
  (req, res, next) => {
    req.body.accountId = req.params.id;
    next();
  }, deleteTransaction);


