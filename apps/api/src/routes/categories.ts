import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { list, create, update, deleteCategory } from "../controllers/categories.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", authenticate, list);
categoriesRouter.post("/", authenticate, create);
categoriesRouter.put("/:id", authenticate, update);
categoriesRouter.delete("/:id", authenticate, deleteCategory);

