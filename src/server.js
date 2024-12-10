const express = require("express");
const cors = require("cors");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const SocketConnections = require("./socket_connections");
const generateRandomString = require("./generate_random_string");

const app = express();
app.use(cors());

// Settting up socket to manage notifications
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.use((socket, next) => {
  const userId = socket.handshake.auth.userId;
  console.log("handshake auth", socket.handshake.auth);
  if (!userId) {
    return next(new Error("Missing handshake auth"));
  }
  const sessionID = socket.handshake.auth.sessionID;
  if (!sessionID) {
    const newSID = generateRandomString();
    socket.sessionID = newSID;
  } else {
    socket.sessionID = sessionID;
  }

  socket.userId = userId;

  next();
});

io.on("connection", (socket) => {
  console.log("new socket connected. ID: ", socket.id);
  const userId = socket.userId;

  const sid = SocketConnections.newSocket(
    userId,
    socket,
    socket.sessionID,
    socket.id
  );
  socket.emit("sessionID", sid);

  socket.on("disconnect", (reason) => {
    console.log("socket disconnected", socket.id, reason);
    SocketConnections.removeSocket(socket.userId, socket.id);
  });
});

app.get("/generate-notif", (req, res) => {
  const userId = parseInt(req.query.id);
  SocketConnections.emitMessageOnSockets(
    userId,
    `notification for user ${userId}`
  );

  res.send("ok");
});

server.listen(5000, () => {
  console.log("listening on port: 5000");
});
