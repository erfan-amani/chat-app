const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const path = require("path");
const Filter = require("bad-words");
require("dotenv").config();

const { generateMessage, generateLocationMessage } = require("./utils/message");
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

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Message contain profane!");
    }

    io.emit("message", generateMessage(message));
    callback();
  });

  socket.emit("message", generateMessage("Welcome to chat."));
  socket.broadcast.emit("message", generateMessage("A new user has joined!"));

  socket.on("sendLocation", (coords, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left!"));
  });
});

module.exports = server;
