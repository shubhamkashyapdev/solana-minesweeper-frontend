import { Schema, model } from "mongoose";

export interface User {
  name: string;
  wallet: string;
  socketId: string;
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    wallet: { type: String, required: true },
    socketId: { type: String },
  },
  { timestamps: true }
);

export const userModal = model<User>("Users", userSchema);
