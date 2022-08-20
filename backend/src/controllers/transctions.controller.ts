import { transctionModal } from "../models/transction.modal";
import { Request, Response } from "express";

export const getAllTransction = async (req: Request, res: Response) => {};

export const addTrasction = async (
  amount: number,
  walletId: string,
  signature: string,
  status: boolean
) => {
  const newTransction = new transctionModal({
    amount: amount,
    walletId: walletId,
    signature: signature,
    status: status,
  });
  try {
    const transction = await newTransction.save();
    // console.log({ transction });
    return transction._id;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const updateTransction = async (
  id: string,
  signature: string,
  isPaid: boolean
) => {
  const find = await transctionModal.findOne({ _id: id });
  if (find) {
    find.signature = signature;
    find.status = isPaid;
    await find.save();
  }
};
