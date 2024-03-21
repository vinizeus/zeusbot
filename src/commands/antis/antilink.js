const logger = require("../../middlewares/logger");
const fs = require("fs");

const { sendsWithBot } = require("../../functions/sends/sends");
const { updateGroup } = require("../../functions/sends/groupSettings");

module.exports = bot = async (bot, msg, chatUpdate, store) => {
  const b = sendsWithBot(bot, msg);
  const g = updateGroup(bot, msg);

  const groupMetadata = g.isGroup ? await bot.groupMetadata(g.remoteJid) : "";
  const participants = g.isGroup ? await groupMetadata.participants : "";

  const groupAdmins = g.isGroup
    ? await participants.filter((v) => v.admin !== null).map((v) => v.id)
    : "";

  const participant = g.isGroup
    ? msg.key.participant.includes("@")
      ? msg.key.participant.split("@")[0] + "@s.whatsapp.net"
      : msg.key.participant
    : g.remoteJid;

  const isAdmins = g.isGroup ? await groupAdmins.includes(participant) : false;

  if (g.isAntiLink) {
    if (
      g.body.includes("https://") ||
      g.body.includes("http://") ||
      g.body.includes("wa.me/") ||
      g.body.includes("instagram.com") ||
      g.body.includes("youtu.be") ||
      g.body.includes("s.kwai.app") ||
      g.body.includes(".com/") ||
      g.body.includes(".br") ||
      g.body.includes("bit.ly") ||
      g.body.includes("adf.ly") ||
      g.body.includes(".net") ||
      g.body.includes(".org") ||
      g.body.includes(".com")
    ) {
      //if (isAntiLinkHard) return;
      if (isAdmins || g.Isme) return;
      try {
        b.sendTextWithMention(` Links são proíbidos nesse grupo, @${participant.split("@")[0]}!`, [participant]);
        logger.warn("[ GRUPO ] - User: Link apagado!");
        return b.deleteMessage(msg.key);
      } catch (error) {
        logger.error(
          `[ ERROR ] Antilink: Ocorreu um erro ao remover o usuario`
        );
        b.sendOwnerError(error.message);
        b.sendErrorReply(error.message);
      }
    }
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  logger.warn(`[ SIS ] - A: Arquivo ${__filename} foi modificado`);
  delete require.cache[file];
  require(file);
});
