const { download } = require("../extras/util");

const downloadImage = async (msg, fileName) =>
  await download(msg, fileName, "image", "png");

const downloadAudio = async (msg, fileName) =>
  await download(msg, fileName, "audio", "mp3");

const downloadSticker = async (msg, fileName) =>
  await download(msg, fileName, "sticker", "webp");

const downloadVideo = async (msg, fileName) =>
  await download(msg, fileName, "video", "mp4");

module.exports = {
  downloadAudio,
  downloadImage,
  downloadSticker,
  downloadVideo,
};
