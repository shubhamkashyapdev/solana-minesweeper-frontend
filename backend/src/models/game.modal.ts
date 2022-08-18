import { Schema, model } from "mongoose";

interface Game {
  player1: any;
  player2: any;
  amount: number;
}

const gameShema = new Schema<Game>({
  amount: { type: Number, required: true },
  player1: { type: Schema.Types.ObjectId, ref: "Users" },
  player2: { type: Schema.Types.ObjectId, ref: "Users" },
});

export const gameModel = model<Game>("Game", gameShema);
