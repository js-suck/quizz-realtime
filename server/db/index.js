const connection = require("./db");
const fs = require("fs");
const path = require("path");

const database = { connection };

const files = fs.readdirSync(path.join(__dirname, "models"));
console.log("files", files)
files.forEach((file) => {

  if (file.endsWith(".map")) return;
  const model = require(path.join(__dirname, "models", file))(connection);
  database[model.name] = model;
});


const initDb = async () => {
    await connection.sync({ force: false });
    console.log("Database synchronised");
}

database["Answer"].belongsTo(database["Question"], {
       foreignKey: "questionId",
       as: "question",
    });

database["Question"].hasMany(database["Answer"], {
    foreignKey: "questionId",
    as: "answers",
});

database["Question"].belongsTo(database["Category"], {
    foreignKey: "categoryId",
    as: "category",
});

database["Category"].hasMany(database["Question"], {
    foreignKey: "categoryId",
    as: "question",
});

console.log("database", database)

module.exports = {
    database,
    initDb,
}
