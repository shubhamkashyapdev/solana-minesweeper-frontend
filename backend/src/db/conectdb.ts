import mongoose from "mongoose";
import config from "config";

export const connectToDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://minesweeper:minesweeper@minesweeper.1iteczv.mongodb.net/minesweeper"
    );
    console.log("connected to mongodb");
  } catch (err) {
    console.log({ err });
    process.exit();
  }
};
