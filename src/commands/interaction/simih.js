const logger = require("../../middlewares/logger");

const fs = require("fs");
const axios = require("axios");

const { sendsWithBot } = require("../../functions/sends/sends");
const { updateGroup } = require("../../functions/sends/groupSettings");

const { PREFIX, BASEURL } = require("../../config");

module.exports = bot = async (bot, msg, chatUpdate, store) => {
  const b = sendsWithBot(bot, msg);
  // const r = reactWithBot(bot, msg);
  const g = updateGroup(bot, msg);

  if (g.Isme) return;
  if (!g.ismodoSimi) return;
  if (g.body && !g.body.startsWith(PREFIX)) {
    try {
      axios.get(`${BASEURL}ia/simsimi/?text=${g.body}`).then((res) => {
        b.sendReply(res.data.texto.message);
      });
    } catch (error) {
      logger.error(
        `[ ERROR ] - CRIT: Ocorreu um erro ao ler as mensagens. ` + err
      );
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
