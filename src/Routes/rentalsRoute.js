import { Router } from "express";

import { validateBody, validateIdPost, validateIdDelete } from "../middlewares/rentalsMiddlewares.js";
import { insertRental, listRentals, finishRental, deleteRental, getRentalsMetrics } from "../controllers/rentalsControllers.js";

const router = Router();

router.get("/rentals", listRentals);
router.get("/rentals/metrics", getRentalsMetrics)
router.post("/rentals", validateBody, insertRental);
router.post("/rentals/:id/return", validateIdPost, finishRental);
router.delete("/rentals/:id", validateIdDelete, deleteRental);

export default router;