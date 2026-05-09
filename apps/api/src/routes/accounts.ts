import { Router } from "express";
import { list, create, update, deleteAccount } from "../controllers/account.js";
import { authenticate } from "../middleware/auth.js";

export const accountsRouter = Router();

accountsRouter.get("/", authenticate, list);
accountsRouter.post("/", authenticate, create);
accountsRouter.put("/:id", authenticate, update);
accountsRouter.delete("/:id", authenticate, deleteAccount);

