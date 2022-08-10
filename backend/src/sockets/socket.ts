import { Server } from "socket.io";

export const init = (server: any) => {
  const io = new Server(server, { cors: { origin: "*" } });
  return io;
};
