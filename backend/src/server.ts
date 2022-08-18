import express from "express";
import config from "config";
import { init } from "./sockets/socket";
import { connectToDB } from "./db/conectdb";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import fileupload from "express-fileupload";

import userRotes from "./routes/user.registration.route";
import gameRoutes from "./routes/game.route";
import searchOpponent from "./routes/searchOpponent.route";
import { availableUserModel } from "./models/AvailableForMatching.modal";
import { userModal } from "./models/user.models";
import {
  addtoOnlineList,
  removeUser,
} from "./controllers/online.users.controller";
import onlineUsersRoute from "./routes/OnlineUsers.route";

const app = express();
const PORT = config.get("PORT");

app.use(fileupload({ useTempFiles: true, tempFileDir: "/temp/" }));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/", userRotes);
app.use("/", gameRoutes);
app.use("/", searchOpponent);
app.use("/", onlineUsersRoute);

connectToDB();

const server = app.listen(PORT, () => {
  console.log("Server is Running");
});

const socketIo: any = init(server);

socketIo.use(async (socket: any, next: any) => {
  const walletId = socket.handshake.auth.walletId;
  const checkUser = await userModal.findOne({ wallet: walletId });
  console.log({ checkUser, walletId });
  if (!walletId) {
    return socket.disconnect();
  } else if (checkUser) {
    // console.log(checkUser);
    checkUser.socketId = socket.id;
    checkUser.save();
    await addtoOnlineList(checkUser);
  } else {
    const newUser = new userModal({
      name: "",
      socketId: socket.id,
      wallet: walletId,
      profilePic: "",
    });
    await newUser.save();
    console.log({ newUser });
  }

  next();
});

socketIo.on("connection", async (socket: any) => {
  console.log("client Connected with id ", socket.id);
  socket.emit("message", `connected with id ${socket.id}`);

  socket.on("message", (msg: any) => {
    console.log({ msg });
  });

  socket.on("disconnect", () => {
    console.log("ueser Disconnected with id ", socket.id);
    removeUser(socket.id);
  });

  socket.on("msgToCustomRoom", (msg: string, roomId: string) => {
    // msg to custome room
    socket.in(roomId).emit("message", msg);
  });

  socket.on(
    "availableForMatch",
    async (walletId: any, amount: any, level: any) => {
      console.log("Player Available for Match", walletId);

      const checkUser = await userModal.findOne({ wallet: walletId });
      if (checkUser) {
        const newEntry = new availableUserModel({
          // adding current user to available list
          amount: amount,
          level: level,
          userId: checkUser._id,
          socketId: checkUser.socketId,
          profilePic: checkUser.profilePic,
        });
        await newEntry.save();

        startMatching(socket, newEntry);
      }
    }
  );
});

async function startMatching(socket: any, data: any) {
  console.log({ data });
  try {
    console.log("starting Search");

    // let count = 0;
    let isOpponent = false;

    while (!isOpponent) {
      const checkAvailablility = await availableUserModel.find({
        userId: data.userId,
        amount: data.amount,
        level: data.level,
      });

      if (!checkAvailablility) {
        return (isOpponent = true);
      }

      const opponent = await availableUserModel.findOne({
        userId: { $ne: data.userId },
        amount: data.amount,
        level: data.level,
      });
      if (opponent) {
        await availableUserModel.findOneAndRemove({
          userId: opponent.userId,
        });
        await availableUserModel.findOneAndRemove({ userId: data.userId });
        socket.to(opponent.socketId).emit("gotOpponent", data, data.socketId);
        socket
          .to(data.socketId)
          .emit("gotOpponent", opponent, opponent.socketId);
        console.log({ opponent });
        // addnewGameEntry(data.userId, opponent.userId, data.amount);

        isOpponent = true;
      } else {
        socket.emit("noOpponent", {
          opponent: false,
          message: "no oppenent Found",
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}
