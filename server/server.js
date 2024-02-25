const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const {database, initDb} = require('./db');
const { Client } = require('pg');
const RealTimeQuizzSocket = require("./socket");
const categoryRouter = require('./router/categoryRouter');
const questionRouter = require('./router/questionRouter');
const answerRouter = require("./router/answerRouter");


const app = express();
app.use(express.json()); // Pour parser le corps des requêtes JSON


app.use(cors());
const server = http.createServer(app);
new RealTimeQuizzSocket(server);


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



const PORT = process.env.PORT || 3002;

app.use('/api/category',categoryRouter);
app.use('/api/questions',questionRouter);
app.use('/api/answers', answerRouter); 





server.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
