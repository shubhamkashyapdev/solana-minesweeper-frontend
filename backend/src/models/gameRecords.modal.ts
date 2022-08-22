import { Schema, model } from "mongoose";

interface GameRecord {
  gameId: string;
  user1: any;
  user2: any;
}

const newSchema = new Schema<GameRecord>(
  {
    gameId: { type: String, required: true },
    user1: { type: Schema.Types.ObjectId, ref: "Transctions" },
    user2: { type: Schema.Types.ObjectId, ref: "Transctions" },
  },
  { timestamps: true }
);

export const gameRecordsModal = model<GameRecord>("GameTransction", newSchema);
