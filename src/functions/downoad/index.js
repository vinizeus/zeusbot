const download = async ({ bot, msg }) => {
  const download = async (msg, fileName, context, extension) => {
    const content = this.getContent(msg, context);

    if (!content) {
      return null;
    }

    const stream = await downloadContentFromMessage(content, context);

    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const filePath = path.resolve(TEMP_DIR, `${fileName}.${extension}`);

    await writeFile(filePath, buffer);

    return filePath;
  };
  const downloadImage = async (msg, fileName) =>
    await download(msg, fileName, "image", "png");

  const downloadAudio = async (msg, fileName) =>
    await download(msg, fileName, "audio", "mp3");

  const downloadSticker = async (msg, fileName) =>
    await download(msg, fileName, "sticker", "webp");

  const downloadVideo = async (msg, fileName) =>
    await download(msg, fileName, "video", "mp4");

  const downloadProfileImage = async (number) =>
    await bot.profilePictureUrl(number);

  return {
    download,
    downloadImage,
    downloadAudio,
    downloadSticker,
    downloadVideo,
    downloadProfileImage,
  };
};
module.exports = download;
