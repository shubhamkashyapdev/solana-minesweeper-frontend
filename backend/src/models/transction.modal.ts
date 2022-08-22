import { Schema, model } from "mongoose";

interface Transction {
  walletId: string;
  amount: number;
  signature: string;
  status: Boolean;
}

const transctionSchema = new Schema<Transction>(
  {
    walletId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const transctionModal = model<Transction>(
  "Transctions",
  transctionSchema
);
