
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(cors({ origin: allowedOrigins }));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
  res.json({
    project: "Carventory",
    experiment: "Experiment 8 - Real-Time Chat",
    status: "running"
  });
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("chatMessage", (data) => {
    if (
      !data ||
      typeof data.username !== "string" ||
      typeof data.message !== "string"
    ) {
      return;
    }

    const username = data.username.trim().slice(0, 30);
    const message = data.message.trim().slice(0, 500);

    if (!username || !message) return;

    io.emit("chatMessage", {
      username,
      message,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 5001;

server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});
