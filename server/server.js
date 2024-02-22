const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const {database, initDb} = require('./db');
const { Client } = require('pg');

const app = express();

app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const pgClient = new Client({
  connectionString: 'postgres://root:password@localhost:5432/app'
});

pgClient.connect()
    .then(() => {
      console.log('Connecté à PostgreSQL avec succès');
        initDb().then(r =>
          console.log("Database synchronised")
        )
    })
    .catch((error) => {
      console.error('Erreur lors de la connexion à PostgreSQL :', error);
    });

io.on("connection", (socket) => {
  console.log("Nouvel utilisateur connecté");

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
