const Jimp = require("jimp");

const { getQuotedMessage } = require("../extras");
const { reactWithBot } = require("./reacts");
const currentTime = new Date();
const formattedTime = currentTime.toISOString();
const { BOT_NAME, GROUP_LINK, PREFIX } = require("../../config");
const logger = require("../../middlewares/logger");
const reSize = async (buffer, ukur1, ukur2) => {
  return new Promise(async (resolve, reject) => {
    var baper = await Jimp.read(buffer);
    var ab = await baper.resize(ukur1, ukur2).getBufferAsync(Jimp.MIME_JPEG);
    resolve(ab);
  });
};

const logo = async () => {
  const logos = await reSize("./assets/img/evo.png", 300, 300);
  return { logos };
};

const {
  ERROR_EMOJI,
  WAIT_EMOJI,
  WARN_EMOJI,
  SUCESS_EMOJI,
  owner,
} = require("../../config");

exports.sendsWithBot = (bot, msg) => {
  const r = reactWithBot(bot, msg);

  const fatkuns = msg.quoted || msg;
  const quoted = getQuotedMessage(fatkuns);
  const remoteJid = msg?.key?.remoteJid;

  return {
    async sendReply(text) {
      await bot.sendMessage(remoteJid, { text: `${text}` }, { quoted: msg });
    },

    async sendText(text, options) {
      await bot.sendMessage(remoteJid, { text: text }, { quoted: options });
    },
    async sendUser(user, text, options) {
      await bot.sendMessage(user, { text: text }, { quoted: options });
    },

    async sendTextWithMention(text, mention) {
      await bot.sendMessage(
        remoteJid,
        { text: text, mentions: mention },
        { quoted: msg }
      );
    },

    async sendMenu(menu) {
      const { logos } = await logo();
      msgg = `Gratos por usar nosso bot! 🤗 Dúvidas? Digite /guia`
      await bot.sendMessage(
        remoteJid,
        {
          text: msgg
        }, {
        quoted: msg
      }
      )
      await bot.sendMessage(
        remoteJid,
        {
          text: menu,
          contextInfo: {
            externalAdReply: {
              title: `${BOT_NAME}!`,
              body: "🌆 Inteligência Artificial!",
              reviewType: "PHOTO",
              thumbnailUrl: logos,
              sourceUrl: `${GROUP_LINK}`,
              mediaType: 2

            },
          },
        },
        {
          quoted: msg,
        }
      );
    },

    async sendOwnerError(text) {
      for (const dono of owner) {
        await bot.sendMessage(
          `${dono}@s.whatsapp.net`,
          {
            text: `_*Oops.. Ocorreu um erro!*_\n\n*ERRO:* ${text}\n\n_Data e Hora: *${formattedTime}*_`,
          },
          { quoted: msg }
        );
      }
      logger.error("[ ERROR ] `O erro foi relatado com exito!");
    },
    async sendOwnerMessage(text) {
      for (const dono of owner) {
        await bot.sendMessage(
          `${dono}@s.whatsapp.net`,
          {
            text: `${text}`,
          },
          { quoted: null }
        );
      }
      logger.warn(
        "[ WhatsApp ] - M: Mensagem enviada para meus donos com exito"
      );
    },
    async sendSuccessReply(text) {
      await r.sendSuccessReact();
      return await this.sendReply(`${SUCESS_EMOJI} ${text}`);
    },

    async sendWaitReply(text) {
      let { key } = await bot.sendMessage(
        remoteJid,
        { text: "▒▒▒▒▒▒▒▒▒  0%" },
        { quoted: msg }
      );
      await bot.sendMessage(remoteJid, { text: "█████▒▒▒▒▒ 50%", edit: key });
      await bot.sendMessage(remoteJid, { text: "██████████ 100%", edit: key });
      await bot.sendMessage(remoteJid, {
        text: `「 ✔ 」 *Processando sua solicitação...*`,
        edit: key,
      });
    },

    async sendWaitReply2(text) {
      let { key } = await bot.sendMessage(
        remoteJid,
        { text: "▒▒▒▒▒▒▒▒▒  0%" },
        { quoted: msg }
      );
      await bot.sendMessage(remoteJid, { text: "█████▒▒▒▒▒ 50%", edit: key });
      await bot.sendMessage(remoteJid, { text: "██████████ 100%", edit: key });
      await bot.sendMessage(remoteJid, {
        text: `「 ✔ 」 *Processando sua solicitação...*`,
        edit: key,
      });
    },

    async sendWarningReply(text) {
      await r.sendWarningReact();
      return await this.sendReply(`${WARN_EMOJI} _Atenção!_ \n${text}`);
    },

    async sendErrorReply(text) {
      await r.sendErrorReact();
      return await this.sendReply(`${ERROR_EMOJI} *Erro!*\n${text}`);
    },

    async catalogReply(texto) {
      const { logos } = await logo();
      bot.sendMessage(
        remoteJid,
        { text: texto },
        {
          quoted: {
            key: {
              fromMe: false,
              participant: `0@s.whatsapp.net`,
              ...(remoteJid
                ? { remoteJid: "554792091566@s.whatsapp.net" }
                : {}),
            },
            message: {
              productMessage: {
                product: {
                  productImage: {
                    mimetype: "image/jpeg",
                    jpegThumbnail: logos,
                  },
                  title: `${BOT_NAME}`,
                  description: "bot de whatsapp\n\n",
                  currencyCode: "BRL",

                  priceAmount1000: "100000",
                  retailerId: "Ghost",
                  productImageCount: 1,
                },
                businessOwnerJid: `0@s.whatsapp.net`,
              },
            },
          },
        }
      );
    },
    async verifiedReply(texto) {
      const { logos } = await logo();
      bot.sendMessage(
        remoteJid,
        { text: texto },
        {
          quoted: {
            key: { fromMe: false, participant: "0@s.whatsapp.net" },
            message: {
              extendedTextMessage: {
                text: `${BOT_NAME}`,
                title: `TM`,
                jpegThumbnail: logos,
              },
            },
          },
        }
      );
    },

    async sendPoll(jid, name = "", values = [], selectableCount = 1) {
      bot.sendMessage(jid, { poll: { name, values, selectableCount } });
    },

    async sendDlAudio(url, titulo, logo) {
      bot.sendMessage(remoteJid, {
        audio: {
          url: url,
        },
        mimetype: "audio/mpeg",
        fileName: `${BOT_NAME}`,
      });
    },
    async sendBase64(image, text) {
      bot.sendMessage(remoteJid, {
        image: Buffer.from(image, "base64"),
        caption: text,
      });
    },
    async deleteMessage(key) {
      await bot.sendMessage(remoteJid, { delete: key });
    },
  };
};
