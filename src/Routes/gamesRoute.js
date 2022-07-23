import { Router } from "express";

import validateBody from "../middlewares/validateGamesMiddleware.js";
import { insertGame, listGames } from "../controllers/gamesControllers.js";

const router = Router();

router.get("/games", listGames);
router.post("/games", validateBody, insertGame);

export default router;