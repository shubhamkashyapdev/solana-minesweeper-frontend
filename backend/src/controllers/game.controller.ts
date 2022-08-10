import { Request, Response } from "express";
import { gameModel } from "../models/game.modal";

export const gameHistory = async (req: Request, res: Response) => {
  // all docs of game history
  const playerId = req.body.playerId;
  if (!playerId) {
    res.status(400).json({ success: false, message: "palyerId Required" });
  }
  try {
    const gameHistory = await gameModel.find({
      or$: [{ player1: playerId }, { player2: playerId }],
    });
    // console.log({ gameHistory });
    res.json({ success: true, data: gameHistory });
  } catch (err) {
    console.log({ err });
    res
      .status(400)
      .json({ err: err, success: false, message: "error occured" });
  }
};

export const addToHistory = async (req: Request, res: Response) => {
  // add a record to history
  const player1 = req.body.player1Id;
  const player2 = req.body.player2Id;
  const amount = req.body.amount;

  if (!player1 || !player2 || !amount) {
    res.status(400).json({
      message: "player1Id, player2Id, amount required",
      success: false,
    });
  }

  try {
    const newGame = new gameModel({
      amount: amount,
      player1: player1,
      player2: player2,
    });

    await newGame.save();
    res.json({ success: true, message: "game added to History" });
  } catch (err) {
    console.log({ err });
    res.status(400).json({ err: err, success: false });
  }
};
