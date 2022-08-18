import { transctionModal } from "../models/transction.modal";
import { Request, Response } from "express";

export const getAllTransction = async (req: Request, res: Response) => {
  const walletId = req.body.walletId;

  if (!walletId) {
    res.status(400).json({ success: false, message: "Pls Provide walletId" });
  }

  try {
    const transction = await transctionModal.find({ walletId: walletId });
  } catch (err) {
    res.status(400).json({ success: false, err: err });
  }
};

export const addTrasction = async (data: any) => {
  const newTransction = new transctionModal({
    amount: data.amount,
    user: data.user,
  });
  try {
    await newTransction.save();
    return true;
  } catch (err) {
    return { err: err, success: false };
  }
};
