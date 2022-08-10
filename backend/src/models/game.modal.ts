import { Schema, model } from "mongoose";

interface Game {
  player1: string;
  player2: string;
  amount: number;
}

const gameShema = new Schema<Game>({
  amount: { type: Number, required: true },
  player1: { type: String, required: true },
  player2: { type: String, required: true },
});

export const gameModel = model<Game>("Game", gameShema);
