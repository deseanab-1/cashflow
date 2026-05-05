import { Router } from "express";
import { healthRouter } from "./health.js";
import { authRouter } from "./auth.js";
import { categoriesRouter } from "./categories.js";
import { accountsRouter } from "./accounts.js";
import { transactionsRouter } from "./transactions.js";
import { budgetsRouter } from "./budgets.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/accounts", accountsRouter);
apiRouter.use("/transactions", transactionsRouter);
apiRouter.use("/budgets", budgetsRouter);

