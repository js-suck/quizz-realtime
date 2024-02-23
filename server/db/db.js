const SequelizeInstance = require("sequelize");

const SequelizeConnection = new SequelizeInstance("postgres://root:password@localhost:5432/app", {
  dialect: "postgres",
});

SequelizeConnection
  .authenticate()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

module.exports = SequelizeConnection;
