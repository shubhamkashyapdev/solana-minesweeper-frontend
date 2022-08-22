import { Request, Response } from "express";
import { gameModel } from "../models/game.modal";

export const gameHistory = async (req: Request, res: Response) => {
  // all docs of game history
  const playerId = req.body.playerId;
  if (!playerId) {
    res.status(400).json({ success: false, message: "palyerId Required" });
  }
  try {
    const gameHistory = await gameModel
      .find({
        or$: [{ player1: playerId }, { player2: playerId }],
      })
      .populate("player1")
      .populate("player2");
    // console.log({ gameHistory });
    res.json({ count: gameHistory.length, success: true, data: gameHistory });
  } catch (err) {
    console.log({ err });
    res
      .status(400)
      .json({ err: err, success: false, message: "error occured" });
  }
};

export const addGame = async (
  player1: string,
  player2: string,
  amount: number
) => {
  try {
    console.log("adding game to list");
    const newEntry = new gameModel({
      player1: player1,
      player2: player2,
      amount: amount,
    });
    await newEntry.save();
  } catch (err) {
    console.log({ err });
  }
};
