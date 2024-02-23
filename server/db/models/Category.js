
module.exports = (connection) => {
const { DataTypes, Model } = require("sequelize");

class Category extends Model {}

Category.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate :{
        notNull: {
          msg: "Le nom de la catégorie est obligatoire",
          },
    },
  },
    description:{
      type: DataTypes.STRING,
      allowNull: true
      },
      image_url:{
        type: DataTypes.STRING,
        allowNull: true
        },
  },
  { sequelize: connection, tableName: "categories" }
);

return Category;

}