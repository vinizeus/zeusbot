const { ConnectToMongo } = require("./middlewares/mongo");
const { connect } = require("./conect/connect");
const { updateContacts } = require("./events/contacts");
const { UpdateMessage } = require("./events/updateMessage");
const { upsertMessage } = require("./events/upsertMessage");
const { welcome } = require("./events/participantsUpdate");
const consoleWelcome = require("./functions/console/index");

const { DBUSER, DBPASS } = require("./config");

async function start() {
  ConnectToMongo(DBUSER, DBPASS);
  consoleWelcome();
  const bot = await connect();
  updateContacts(bot);
  UpdateMessage(bot);
  upsertMessage(bot);
  welcome(bot);
}

start();
