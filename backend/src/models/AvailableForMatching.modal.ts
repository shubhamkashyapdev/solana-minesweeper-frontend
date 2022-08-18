import { Schema, model } from "mongoose";

interface Entry {
  amount: number;
  userId: string;
  socketId: string;
  profilePic: string;
}

const availableUserSchema = new Schema({
  amount: { type: Number, rquired: true },
  level: { type: Number, required: true },
  userId: { type: String, required: true },
  socketId: { type: String, required: true },
  profilePic: { type: String, required: false },
});

export const availableUserModel = model<Entry>(
  "AvailbleUsers",
  availableUserSchema
);
