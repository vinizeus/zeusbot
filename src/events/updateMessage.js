const { getAggregateVotesInPollMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");

const { store } = require("../conect/connect");
const { PREFIXO, BOT_NAME } = require("../config");
const logger = require("../middlewares/logger");

async function getMessage(key) {
  if (store) {
    const msg = await store.loadMessage(key.remoteJid, key.id);
    return msg?.message;
  }
  return {
    conversation: `Ola! ${BOT_NAME} conectado!`,
  };
}

exports.UpdateMessage = (bot) => {
  bot.ev.on("messages.update", async (chatUpdate) => {
    try {
      for (const { key, update } of chatUpdate) {
        if (update.pollUpdates && key.fromMe) {
          const pollCreation = await getMessage(key);
          if (pollCreation) {
            const pollUpdate = await getAggregateVotesInPollMessage({
              message: pollCreation,
              pollUpdates: update.pollUpdates,
            });
            var toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]
              ?.name;
            if (toCmd == undefined) return;
            var prefCmd = `${PREFIXO + toCmd}`;
            bot.appenTextMessage(prefCmd, chatUpdate);
          }
        }
      }
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
