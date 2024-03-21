const logger = require("../../middlewares/logger");
const fs = require("fs");

const { BOT_EMOJI, PREFIX } = require("../../config");
const { sendsWithBot } = require("../../functions/sends/sends");
const { reactWithBot } = require("../../functions/sends/reacts");
const { updateGroup } = require("../../functions/sends/groupSettings");

module.exports = bot = async (bot, msg, chatUpdate, store) => {
  const b = sendsWithBot(bot, msg);
  const r = reactWithBot(bot, msg);
  const g = updateGroup(bot, msg);
  const pushname = msg.pushName || "Joao Gabriel";

  if (g.Isme) return;
  let gbody = g.body.toLowerCase();

  if (gbody) {
    if (gbody.includes("bot")) {
      r.sendReact(BOT_EMOJI);
    } else

      if (gbody.includes("Zeus")) {
      b.sendReply(`lindo demais`);
    }
      else if (gbody == "bom dia") {
        b.sendReply(
          `Bom dia ${pushname}! Como você esta? \n\n Caso queira ouvir um conselho digite ${PREFIX}conselho`
        );
      } else
        if (gbody == "boa tarde") {
          b.sendReply(
            `Boa tarde ${pushname}! Como você esta? Espero que seu dia esteja sendo bom!`
          );
        } else
          if (gbody == "boa noite") {
            b.sendReply(
              `Boa noite ${pushname}! Como você está? Epero que possamos nos encontrar novamente amanhã!`
            );
          }
};
}

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  logger.warn(`[ SIS ] - A: Arquivo ${__filename} foi modificado`);
  delete require.cache[file];
  require(file);
});
