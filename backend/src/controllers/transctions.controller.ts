import { transctionModal } from "../models/transction.modal";
import { Request, Response } from "express";

export const getAllTransction = async (req: Request, res: Response) => {};

export const addTrasction = async (data: any) => {
  const newTransction = new transctionModal({
    amount: data.amount,
    walletId: data.walletId,
    signature: data.signature,
  });
  try {
    await newTransction.save();
    return { startGame: true };
  } catch (err) {
    return { err: err, startGame: false };
  }
};
