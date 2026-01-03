const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  // When a user joins
  socket.on("join", (username) => {
    onlineUsers[socket.id] = username;
    io.emit("updateUsers", Object.values(onlineUsers));
  });

  // When a user sends a chat message
  socket.on("chat message", (msg) => {
    // Broadcast to everyone (including sender)
    io.emit("chat message", msg);
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    io.emit("updateUsers", Object.values(onlineUsers));
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
