import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { list, create, update, deleteBudget } from '../controllers/budget';

export const budgetsRouter = Router();

budgetsRouter.get("/", authenticate, list);
budgetsRouter.post("/", authenticate, create);
budgetsRouter.put("/:id", authenticate, update);
budgetsRouter.delete("/:id", authenticate, deleteBudget);
