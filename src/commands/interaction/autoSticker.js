const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const logger = require("../../middlewares/logger");
const { TEMP_DIR } = require("../../config");

const { sendsWithBot } = require("../../functions/sends/sends");
const { reactWithBot } = require("../../functions/sends/reacts");
const { updateGroup } = require("../../functions/sends/groupSettings");

const {
  downloadImage,
  downloadVideo,
} = require("../../functions/downoad/downloadMedia");

module.exports = bot = async (bot, msg, chatUpdate, store) => {
  const b = sendsWithBot(bot, msg);
  const r = reactWithBot(bot, msg);
  const g = updateGroup(bot, msg);

  const baileysIs = (msg, context) => {
    return (
      !!msg.message?.[`${context}Message`] ||
      !!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[
        `${context}Message`
      ]
    );
  };

  const isImage = baileysIs(msg, "image");
  const isVideo = baileysIs(msg, "video");

  if (!g.isGroup || !g.isAutoSticker || g.Isme) return;
  if (msg && msg?.message) {
    if (isImage || isVideo) {
      const outputPath = path.resolve(TEMP_DIR, "output.webp");

      if (isImage) {
        const inputPath = await downloadImage(msg, "input");

        exec(
          `ffmpeg -i ${inputPath}  -y  -vf scale=512:512 ${outputPath}`,
          async (error) => {
            if (error) {
              console.log(error);
              fs.unlinkSync(inputPath);
              throw new Error(error);
            }

            await r.sendSuccessReact();

            await b.sendStickerFromFile(outputPath);
          }
        );
      } else {
        const inputPath = await downloadVideo(msg, "input");

        const sizeInSeconds = 10;

        const seconds =
          msg.message?.videoMessage?.seconds ||
          msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
            ?.videoMessage?.seconds;

        const haveSecondsRule = seconds <= sizeInSeconds;

        if (!haveSecondsRule) {
          fs.unlinkSync(inputPath);

          await b.sendErrorReply(`O vídeo que você enviou tem mais de ${sizeInSeconds} segundos!
              
              Envie um vídeo menor!`);

          return;
        }

        exec(
          `ffmpeg -i ${inputPath} -y -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512,fps=12,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -f webp ${outputPath}`,
          async (error) => {
            if (error) {
              fs.unlinkSync(inputPath);

              throw new Error(error);
            }

            await r.sendSuccessReact();
            await b.sendStickerFromFile(outputPath);

            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
          }
        );
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
