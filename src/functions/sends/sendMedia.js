const { getQuotedMessage } = require("../extras");
const { reactWithBot } = require("./reacts");
const { BOT_NAME, GROUP_LINK } = require("../../config");
exports.sendMedia = (bot, msg) => {
  const r = reactWithBot(bot, msg);

  const fatkuns = msg.quoted || msg;
  const quoted = getQuotedMessage(fatkuns);
  const remoteJid = msg?.key?.remoteJid;

  return {
    async sendStickerFromFile(file) {
      await bot.sendMessage(
        remoteJid,
        {
          sticker: {
            url: file
          },
          packname: "test", author: "teste",

          contextInfo: {
            externalAdReply: {
              title: `${BOT_NAME}!`,
              body: "🌆 Aqui está o seu sticker!",
              reviewType: "PHOTO",
              thumbnailUrl: `./assets/img/evo.png`,
              sourceUrl: `${GROUP_LINK}`,
              mediaType: 2,
            },
          },
        },
        {
          quoted: msg,
        }
      );
    },

    async image(file, text, teste) {
      await bot.sendMessage(remoteJid, {
        image: { url: file },
        caption: text,
        ...teste,
      });
    },
    async imageUser(user, file, text, teste) {
      await bot.sendMessage(user, {
        image: { url: file },
        caption: text,
        ...teste,
      });
    },

    async document(file, param) {
      await bot.sendMessage(
        remoteJid,
        {
          document: { url: file },
          mimetype: param,
        },
        { quoted: msg }
      );
    },

    async audio(url, opt) {
      bot.sendMessage(
        remoteJid,
        {
          audio: {
            url: url,

          },
          mimetype: "audio/mpeg",
          ptt: opt,
          fileName: `${BOT_NAME}`,
        },
        {
          quoted: msg,
        }
      );
    },
    async video(video, texto) {
      bot.sendMessage(
        remoteJid,
        { video: { url: video }, mimetype: "video/mp4", caption: texto },
        { quoted: msg }
      );
    },

    async apk(apk) {
      bot.sendMessage(
        remoteJid,
        {
          document: { url: apk },
          mimetype: "application/vnd.android.package-archive",
        },
        { quoted: msg }
      );
    },
    async gif(video, texto) {
      bot.sendMessage(
        remoteJid,
        {
          video: { url: video },
          mimetype: "video/mp4",
          gifPlayback: true,
          caption: texto,
        },
        { quoted: msg }
      );
    },
  };
};
