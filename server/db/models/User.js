
module.exports = (connection) => {
  const { DataTypes, Model } = require("sequelize");
  const Mailjet = require("node-mailjet");
  


  const mailjetClient = new Mailjet({
    apiKey: "dfaaa1f406a6a163ed3cfd1c77387ae4",
    apiSecret: "4995cd8aca9ea391cf484eb41210994e",
  });

  class User extends Model {


    async sendVerificationEmail() {
      const request = mailjetClient.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "laila.charaoui@outlook.fr",
              Name: "The best",
            },
            To: [
              {
                Email: this.email,
                Name: `${this.firstname} ${this.lastname}`,
              },
            ],
            Subject: "Vérification de compte",
            HTMLPart: `<p>Bonjour ${
              this.firstname
            },</p><p>Veuillez cliquer sur le lien suivant pour vérifier votre compte : <a href="${generateVerificationLink(
              this.tokenemail
            )}">Vérifier mon compte</a></p>`,
          },
        ],
      });
      request
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err.statusCode);
        });
    }


  }

  User.init(
    {
      lastname: DataTypes.STRING,
      firstname: DataTypes.STRING,
      nickname: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8],
          // is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
        validate: {
          isIn: [["user", "admin"]],
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tokenemail: {
        type: DataTypes.TEXT(10000),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gamesPlayed: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    { sequelize: connection, tableName: "users" }
  );
    User.prototype.toJSON = function () {
        const values = { ...this.get() };
        delete values.password;
        return values;
    };

  function uptadePassword(user) {
    if (user.changed("password")) {
      return bcrypt.hash(user.password, 10).then((hash) => {
        user.password = hash;
      });
    }
  }

  function generateVerificationLink(tokenemail) {
    // Générer le lien de vérification avec l'ID de l'utilisateur
    return `localhost/verify/${tokenemail}`;
  }


  User.addHook("afterCreate", (user) => {
    user.sendVerificationEmail();
  });

  return User;
};


