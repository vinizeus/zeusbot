var selo = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    ...(remoteJid ? { remoteJid: "status@broadcast" } : {}),
  },
  message: {
    imageMessage: {
      url: "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nmsg.enc",
      mimetype: "image/jpeg",
      caption: `${BOT_NAME}`,
    },
  },
};

module.exports = {
  selo,
};
