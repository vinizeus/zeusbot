const fs = require("fs");

const { store } = require("../conect/connect");
const { smsg } = require("../functions/extras");

const logger = require("../middlewares/logger");

exports.upsertMessage = (bot) => {
  bot.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      let mek = chatUpdate?.messages[0];
      if (!mek.message) return;
      mek.message =
        Object.keys(mek.message)[0] === "ephemeralMessage"
          ? mek.message.ephemeralMessage.message
          : mek.message;
      if (mek.key && mek.key.remoteJid === "status@broadcast") return;
      if (!bot.public && !mek.key.fromMe && chatUpdate.type === "notify")
        return;
      let m = smsg(bot, mek, store);
      require("../commands")(bot, m, chatUpdate, store);
      require("../commands/antis/antilink")(bot, m, chatUpdate, store);
      require("../commands/antis/antilinkhard")(bot, m, chatUpdate, store);
      require("../commands/interaction/simih")(bot, m, chatUpdate, store);
      require("../commands/interaction/autoSticker")(bot, m, chatUpdate, store);
      require("../commands/interaction/autoText")(bot, m, chatUpdate, store);
      require("../commands/interaction/autoReply")(bot, m, chatUpdate, store);
    } catch (err) {
      logger.error(
        "[ ERROR ] - CRIT: Ocorreu um erro ao ler as mensagens. " + err
      );
    }
  });
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  logger.warn(`[ SIS ] - A: Arquivo ${__filename} foi modificado`);
  delete require.cache[file];
  require(file);
});
