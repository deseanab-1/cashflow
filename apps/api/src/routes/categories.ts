import { Router } from "express";
import { notImplemented } from "./_notImplemented.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", notImplemented("categories.list"));
categoriesRouter.post("/", notImplemented("categories.create"));
categoriesRouter.put("/:id", notImplemented("categories.update"));
categoriesRouter.delete("/:id", notImplemented("categories.delete"));

