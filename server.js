const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => {
  res.send("<h1>Mon Quiz en temps réel</h1>");
});

io.on("connection", (socket) => {
  console.log("Un utilisateur est connecté");

  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Le serveur tourne sur le port ${PORT}`));
