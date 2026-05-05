import { Router } from "express";
import { notImplemented } from "./_notImplemented.js";

export const budgetsRouter = Router();

budgetsRouter.get("/", notImplemented("budgets.getForMonth"));
budgetsRouter.put("/", notImplemented("budgets.upsertForMonth"));

