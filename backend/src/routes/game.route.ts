import express from "express";
import { gameHistory, addToHistory } from "../controllers/game.controller";
const router = express.Router();

router.post("/gameHistory", addToHistory);
router.get("/gameHistory", gameHistory);

export default router;
