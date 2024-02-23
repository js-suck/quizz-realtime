module.exports = (connection) => {
const { DataTypes, Model } = require("sequelize");
const Question = require("./Question");

class Answer extends Model {}

Answer.init(
  {
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
  },
  { sequelize: connection, tableName: "answers" }
);


return Answer;
};