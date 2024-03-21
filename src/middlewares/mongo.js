const mongoose = require("mongoose");
const logger = require("./logger");

async function ConnectToMongo(dbUser, dbPass) {
  logger.warn("[ DATABASE ] - Mongo: Conectando database...");
  await mongoose
    .connect(
      `mongodb+srv://${dbUser}:${dbPass}@cluster0.6rewenu.mongodb.net/?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      logger.info(
        "[ DATABASE ] - Mongo: Banco de dados foi conectado com exito!"
      );
    })
    .catch((err) => logger.error(err));
}

module.exports = { ConnectToMongo };
