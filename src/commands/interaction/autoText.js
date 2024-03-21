const logger = require("../../middlewares/logger");
const fs = require("fs");

const audioTotext = require("../../functions/upload/uploadAudio");

const { sendsWithBot } = require("../../functions/sends/sends");
const { reactWithBot } = require("../../functions/sends/reacts");
const { updateGroup } = require("../../functions/sends/groupSettings");

module.exports = bot = async (bot, msg, chatUpdate, store) => {
  const b = sendsWithBot(bot, msg);
  const r = reactWithBot(bot, msg);
  const g = updateGroup(bot, msg);

  if (!g.isGroup || !g.isAutotext) return;
  if (msg && msg?.message) {
    const type =
      Object.keys(msg.message)[0] == "senderKeyDistributionMessage"
        ? Object.keys(msg.message)[2]
        : Object.keys(msg.message)[0] == "messageContextInfo"
        ? Object.keys(msg.message)[1]
        : Object.keys(msg.message)[0];

    if (type == "audioMessage") {
      const textAudio = await audioTotext(msg, "pt");

      const textConvert = textAudio.text;
      r.sendReact("🔈");
      b.sendReply(
        `_*Conteúdo:*_ _${textConvert}_\n\n_*Informações extras: ${"\u200B".repeat(
          4000
        )} _Seu áudio de *${
          textAudio.audio_duration
        } segundos* foi convertido em texto com sucesso!_\n_Este texto teve um *total de ${
          textAudio.words.length
        } palavras*, ele foi convertido para *${
          textAudio.language_code
        }*. Felizmente nao ouve Complicações para converter seu audio em texto, caso tenha ocorrido algum problema entre em contato usando *${PREFIX}suporte*_ 🤖
`
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
