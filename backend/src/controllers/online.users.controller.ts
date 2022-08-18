import { onlineUserModal } from "../models/OnlineUser.modal";
import { Request, Response } from "express";
import { availableUserModel } from "../models/AvailableForMatching.modal";
export interface Data {
  wallet: string;
  socketId: string;
  name: string;
  profilePic: string;
}

export const addtoOnlineList = async (data: Data) => {
  console.log("adding user to online array");
  //   console.log({ data });
  const newEntry = new onlineUserModal({
    name: data.name,
    profilePic: data.profilePic,
    socketId: data.socketId,
    wallet: data.wallet,
  });
  await newEntry.save();
};

export const removeUser = async (socketid: string) => {
  console.log("removing user to online array");
  await onlineUserModal.findOneAndRemove({ socketId: socketid });
  await availableUserModel.findOneAndRemove({ socketId: socketid });
};

export const getOnlineusers = async (req: Request, res: Response) => {
  try {
    const result = await onlineUserModal.find();
    res.send({ count: result.length, data: result, success: true });
  } catch (err) {
    res.status(400).json({ success: false, err: err });
  }
};
