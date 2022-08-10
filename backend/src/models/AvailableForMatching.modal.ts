import { Schema, model } from "mongoose";

interface Entry {
  amount: number;
  userId: string;
  socketId: string;
}

const availableUserSchema = new Schema({
  amount: { type: Number, rquired: true },
  userId: { type: String, required: true },
  socketId: { type: String, required: true },
});

export const availableUserModel = model<Entry>(
  "AvailbleUsers",
  availableUserSchema
);
