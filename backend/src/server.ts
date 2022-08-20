import express from "express";
import config from "config";
import { init } from "./sockets/socket";
import { connectToDB } from "./db/conectdb";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import fileupload from "express-fileupload";
import { v4 as uuidv4 } from "uuid";

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
import { addGame } from "./controllers/game.controller";
import {
  addTrasction,
  updateTransction,
} from "./controllers/transctions.controller";
import { gameRecordsModal } from "./models/gameRecords.modal";

const app = express();
const PORT = config.get("PORT");

app.use(fileupload({ useTempFiles: true }));
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
  if (!walletId) {
    return socket.disconnect();
  } else if (checkUser) {
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
    socketIo.to(roomId).emit("message", msg);
  });

  socket.on(
    "updatePayment",
    async (signature: string, isPaid: boolean, id: string, gameId: string) => {
      await updateTransction(id, signature, isPaid);

      socketIo.to(gameId).emit("paymentRecieved", { transctionId: id });

      const payment = await isPayment(gameId);
      if (payment) {
        socketIo.to(gameId).emit("startGame", { startGame: true });
      }
    }
  );

  socket.on("joinCustomRoom", (roomId: string) => {
    // join Custome Room
    socket.join(roomId);
    socket.emit("message", "joined Room");
  });

  socket.on(
    "availableForMatch",
    async (walletId: any, amount: any, level: any) => {
      console.log("Player Available for Match", walletId);

      const checkUser = await userModal.findOne({ wallet: walletId });

      if (checkUser) {
        const alreadySearching = await availableUserModel.findOne({
          userId: checkUser._id,
        });

        if (alreadySearching) {
          console.log("already in Matching");
          socket.emit("message", `alrady in Maching  ${alreadySearching}`);
          return false;
        }

        const newEntry = new availableUserModel({
          // adding current user to available list
          amount: amount,
          level: level,
          userId: checkUser._id,
          socketId: checkUser.socketId,
          profilePic: checkUser.profilePic,
          walletId: checkUser.wallet,
        });
        await newEntry.save();

        startMatching(socket, newEntry);
      }
    }
  );
});

function sleep(time: number, func?: () => void) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(true);
    }, time)
  );
}

async function startMatching(socket: any, data: any) {
  try {
    console.log("starting Search");
    let isOpponent = false;
    while (!isOpponent) {
      // socket.emit("message", "Searching");
      await sleep(5000);
      const checkAvailablility = await availableUserModel.findOne({
        userId: data.userId,
        amount: data.amount,
        level: data.level,
      });

      if (!checkAvailablility) {
        console.log("already paired with someOne");
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

        const p1Id = await addTrasction(
          data.amount,
          data.walletId,
          "false",
          false
        );

        const p2Id = await addTrasction(
          opponent.amount,
          opponent.walletId,
          "false",
          false
        );

        const roomid = uuidv4();
        const newGame = new gameRecordsModal({
          gameId: roomid,
          user1: p1Id,
          user2: p2Id,
        });
        await newGame.save();

        console.log({ opponent, notifiying: "opponent" });
        socket.to(opponent.socketId).emit("gotOpponent", data, roomid, p1Id);
        socket.emit("gotOpponent", opponent, roomid, p2Id);

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

async function isPayment(gameId: string) {
  return new Promise(async (resolve) => {
    const game = await gameRecordsModal
      .findOne({ gameId: gameId })
      .populate("user1")
      .populate("user2");
    if (game) {
      console.log(game);
      if (game.user1.status && game.user1.status) {
        resolve(true);
      } else {
        resolve(false);
      }
    }
  });
}
