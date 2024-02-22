const { DataTypes, Model } = require("sequelize")

module.exports = (connection) => {
    class Question extends Model {}
    
    Question.init(
      {
        label: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      { sequelize: connection, tableName: "questions" }
    );

    return Question;
  };
  