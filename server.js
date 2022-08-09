const Koa = require("koa");
const http = require("http");
const socket = require("socket.io");
const express = require("express");
const cors = require("cors");
const { addUser, getUser } = require("./user");
const { SocketAddress } = require("net");

const app = new Koa();
const server = http.createServer(app.callback());
const io = socket(server, {
  cors: {
    origin: "*",
  },
});

const SERVER_HOST = "localhost";
const SERVER_PORT = 8080;

io.on("connection", (socket) => {
  console.log("[IO] Connection => Server has a new Connection", socket.id);

  socket.on("join", (callback) => {
    const { error, user } = addUser(socket.id);
    if (error) return callback(error);
    callback();
  });

  socket.on("sendMessage", (message) => {
    const userR = getUser(socket.id);
    io.emit("message", { message, user: userR });
    console.log("[SOCKET] Chat.Message => ", {
      message,
      user: userR,
    });
  });

  socket.on("lifeUpdate", (data) => {
    console.log("[SOCKET] LifeUpdate => ", data);
    io.emit("lifeUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("[SOCKET] Disconnect => Disconnected");
  });
});

server.listen(process.env.PORT || SERVER_PORT, SERVER_HOST, () => {
  console.log(
    `[HTTP] Listen => Server is running at  http://${SERVER_HOST}:${SERVER_PORT}`
  );
});
