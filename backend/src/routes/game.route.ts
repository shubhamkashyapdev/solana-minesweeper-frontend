import express from "express";
import { gameHistory } from "../controllers/game.controller";
const router = express.Router();

router.get("/gameHistory", gameHistory);
export default router;
