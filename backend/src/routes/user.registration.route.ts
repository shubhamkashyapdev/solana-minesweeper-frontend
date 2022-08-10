import express from "express";
import { resgister } from "../controllers/registration.controller";
const router = express.Router();

router.post("/registration", resgister);

export default router;
