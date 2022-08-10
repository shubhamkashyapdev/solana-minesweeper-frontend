import { Request, Response } from "express";
import { userModal } from "../models/user.models";

export const resgister = async (req: Request, res: Response) => {
  const name = req.body.name;
  const walletAddress = req.body.walletAddress;

  if (!name || !walletAddress) {
    res
      .status(400)
      .json({ err: "name & wallet address are required", success: false });
  }
  const newUser = new userModal({
    name: name,
    wallet: walletAddress,
  });

  try {
    await newUser.save();
    res.send({ success: true });
  } catch (err) {
    console.log({ err });
    res.status(400).json({ success: false, err });
  }
};
