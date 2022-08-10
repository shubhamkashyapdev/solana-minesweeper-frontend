import { Schema, model } from "mongoose";

interface Transction {
  user: string;
  amount: number;
}

const transctionSchema = new Schema<Transction>(
  {
    user: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const transctionModal = model<Transction>(
  "Transctions",
  transctionSchema
);
