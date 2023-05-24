const express = require("express");

const http = require("http");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

require("./db/mongo");

const publicDir = path.join(__dirname, "../public");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicDir));

io.on("connection", (socket) => {
  console.log("New websocket connection!");

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("sendLocation", (coords) => {
    io.emit(
      "message",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
  });
});

module.exports = server;
