import { Request, Response } from "express";
import { userModal } from "../models/user.models";
import { v4 as uuidv4, v4 } from "uuid";
import { eventEvent } from "../eventEmitter/eventEmitter";
import { availableUserModel } from "../models/AvailableForMatching.modal";

export const startMatching = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const amount = req.body.amount;
  if (!userId || !amount) {
    res
      .status(400)
      .json({ success: false, message: "userId Required & amount Required" });
  }

  try {
    const checkUser = await userModal.findOne({ _id: userId });
    if (checkUser) {
      const newEntry = new availableUserModel({
        // adding current user to available list
        amount: amount,
        userId: checkUser._id,
        socketId: checkUser.socketId,
      });
      await newEntry.save();

      eventEvent("playerAvailble", newEntry);
      res.json({ success: true, message: "add to list", data: newEntry });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "error occured", err: err });
  }
};

// export const findMatch = async (data: any, socketIo) => {
//   try {
//     const opponent = await availableUserModel.findOne({
//       $and: [{ $ne: { _id: data._id, $exist: true } }, { amount: data.amount }],
//     });
//     if (opponent) {
//       console.log(opponent);
//       socketIo.join(opponent.roomId).emit("gotOpponent", data);
//     } else {
//       socketIo.to(data.roomId).emit("noOpponent", {
//         opponent: false,
//         message: "no oppenent Found",
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

export const testEvents = (req: Request, res: Response) => {
  eventEvent("test", "test callled ");
  res.send("ok");
};
