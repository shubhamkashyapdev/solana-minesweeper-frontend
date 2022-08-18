import express from "express";
import { gameHistory, addnewGameEntry } from "../controllers/game.controller";
const router = express.Router();

router.get("/gameHistory", gameHistory);
router.post("/addGameHistory", addnewGameEntry);
export default router;
