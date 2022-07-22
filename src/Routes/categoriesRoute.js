import { Router } from "express";

import { listCategories, insertCategory } from "../controllers/categoriesControllers.js";
import { validateBody } from "../middlewares/validatePostCategoriesBody.js";

const router = Router();

router.get("/categories", listCategories);
router.post("/categories", validateBody, insertCategory);

export default router;