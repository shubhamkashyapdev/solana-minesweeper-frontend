import express from "express";
import config from "config";
import { init } from "./sockets/socket";
import { connectToDB } from "./db/conectdb";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

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

const socketIo = init(server);

socketIo.use(async (socket, next) => {
  const walletId = socket.handshake.auth.walletId;
  const checkUser = await userModal.findOne({ wallet: walletId });
  if (checkUser) {
    // console.log(checkUser);
    checkUser.socketId = socket.id;
    checkUser.save();
    await addtoOnlineList(checkUser);
  }
  next();
});

socketIo.on("connection", async (socket) => {
  console.log("client Connected with id ", socket.id);
  socket.emit("message", `connected with id ${socket.id}`);

  socket.on("message", (msg) => {
    console.log(msg);
  });

  socket.on("connecteToOppoent", (opponentId: string) => {
    socket.join(opponentId);
    socket.emit("msgFromOpponent", "Hello World");
  });

  socket.on("disconnect", () => {
    console.log("ueser Disconnected with id ", socket.id);
    removeUser(socket.id);
  });

  socket.on("availableForMactch", async (id, amount) => {
    console.log("Player Available for Match", id);

    const checkUser = await userModal.findOne({ _id: id });
    if (checkUser) {
      const newEntry = new availableUserModel({
        // adding current user to available list
        amount: amount,
        userId: checkUser._id,
        socketId: checkUser.socketId,
      });
      await newEntry.save();

      startMatching(socket, newEntry);
    }
  });
});

async function startMatching(socket: any, data: any) {
  console.log({ data });
  try {
    console.log("starting Search");

    let count = 0;
    let isOpponent = false;

    while (!isOpponent) {
      const opponent = await availableUserModel.findOne({
        userId: { $ne: data.userId },
        amount: data.amount,
      });
      if (opponent) {
        socket.in(opponent.socketId).emit("gotOpponent", data);
        socket.in(data.socketId).emit("gotOpponent", opponent);
        console.log({ opponent });
        isOpponent = true;
        await availableUserModel.findOneAndRemove({
          userId: opponent.userId,
        });
        await availableUserModel.findOneAndRemove({ userId: data.userId });
      } else {
        // await availableUserModel.findOneAndRemove({ userId: data.userId });
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
