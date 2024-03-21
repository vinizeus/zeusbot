const {
  proto,
  delay,
  getContentType,
  jidDecode,
  areJidsSameUser,
  generateWAMessage,
  downloadContentFromMessage,
} = require("@whiskeysockets/baileys");

const axios = require("axios");
const chalk = require("chalk");
const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");
const Jimp = require("jimp");
const path = require("path");
const { writeFile } = require("fs/promises");

const { TEMP_DIR } = require("../../config");
const logger = require("../../middlewares/logger");

const decodeJid = (jid) => {
  if (!jid) return jid;
  if (/:\d+@/gi.test(jid)) {
    let decode = jidDecode(jid) || {};
    return (
      (decode.user && decode.server && decode.user + "@" + decode.server) || jid
    );
  } else return jid;
};

exports.smsg = (conn, m, store) => {
  if (!m) return m;
  let M = proto.WebMessageInfo;
  if (m.key) {
    m.id = m.key.id;
    m.isBaileys = m.id.startsWith("BAE5") && m.id.length === 16;
    m.chat = m.key.remoteJid;
    m.fromMe = m.key.fromMe;
    m.isGroup = m.chat.endsWith("@g.us");
  }
  if (m.message) {
    m.mtype = getContentType(m.message);
    m.msg =
      m.mtype == "viewOnceMessage"
        ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)]
        : m.message[m.mtype];
    m.body =
      m.message.conversation ||
    m.msg?.caption ||
    m.msg?.text ||
      (m.mtype == "listResponseMessage" &&
        m.msg.singleSelectReply.selectedRowId) ||
      (m.mtype == "buttonsResponseMessage" && m.msg.selectedButtonId) ||
      (m.mtype == "viewOnceMessage" && m.msg.caption) ||
      m?.text;
    let quoted = (m.quoted = m.msg?.contextinfo
      ? m.msg?.contextinfo.quotedMessage
      : null);
    m.mentionedJid = m.msg?.contextinfo ? m.msg?.contextinfo.mentionedJid : [];
    if (m.quoted) {
      let type = Object.keys(m.quoted)[0];
      m.quoted = m.quoted[type];
      if (["productMessage"].includes(type)) {
        type = Object.keys(m.quoted)[0];
        m.quoted = m.quoted[type];
      }
      if (typeof m.quoted === "string")
        m.quoted = {
          text: m.quoted,
        };
      m.quoted.mtype = type;
      m.quoted.id = m.msg?.contextinfo.stanzaId;
      m.quoted.chat = m.msg?.contextinfo.remoteJid || m.chat;
      m.quoted.isBaileys = m.quoted.id
        ? m.quoted.id.startsWith("BAE5") && m.quoted.id.length === 16
        : false;
      m.quoted.sender = decodeJid(m.msg?.contextinfo.participant);
      m.quoted.fromMe = m.quoted.sender === decodeJid(conn.user.id);
      m.quoted.text =
        m.quoted?.text ||
      m.quoted?.caption ||
        m.quoted.conversation ||
        m.quoted.contentText ||
        m.quoted.selectedDisplayText ||
        m.quoted.title ||
        "";
      m.quoted.mentionedJid = m.msg?.contextinfo
        ? m.msg?.contextinfo.mentionedJid
        : [];
      m.getQuotedObj = m.getQuotedMessage = async () => {
        if (!m.quoted.id) return false;
        let q = await store.loadMessage(m.chat, m.quoted.id, conn);
        return exports.smsg(conn, q, store);
      };
      let vM = (m.quoted.fakeObj = M.fromObject({
        key: {
          remoteJid: m.quoted.chat,
          fromMe: m.quoted.fromMe,
          id: m.quoted.id,
        },
        message: quoted,
        ...(m.isGroup ? { participant: m.quoted.sender } : {}),
      }));

      /**
       *
       * @returns
       */
      m.quoted.delete = () =>
        conn.sendMessage(m.quoted.chat, { delete: vM.key });

      /**
       *
       * @param {*} jid
       * @param {*} forceForward
       * @param {*} options
       * @returns
       */
      m.quoted.copyNForward = (jid, forceForward = false, options = {}) =>
        conn.copyNForward(jid, vM, forceForward, options);

      /**
       *
       * @returns
       */
      m.quoted.download = () => conn.downloadMediaMessage(m.quoted);
    }
  }
  if (m.msg.url) m.download = () => conn.downloadMediaMessage(m.msg);
  m.text =
    m.msg?.text ||
  m.msg?.caption ||
    m.message.conversation ||
    m.msg.contentText ||
    m.msg.selectedDisplayText ||
    m.msg.title ||
    "";
  /**
   * Reply to this message
   * @param {String|Object} text
   * @param {String|false} chatId
   * @param {Object} options
   */
  m.reply = (text, chatId = m.chat, options = {}) =>
    Buffer.isBuffer(text)
      ? conn.sendMedia(chatId, text, "file", "", m, { ...options })
      : conn.sendText(chatId, text, m, { ...options });
  /**
   * Copy this message
   */
  m.copy = () => exports.smsg(conn, M.fromObject(M.toObject(m)));

  /**
   *
   * @param {*} jid
   * @param {*} forceForward
   * @param {*} options
   * @returns
   */
  m.copyNForward = (jid = m.chat, forceForward = false, options = {}) =>
    conn.copyNForward(jid, m, forceForward, options);

  conn.appenTextMessage = async (text, chatUpdate) => {
    let messages = await generateWAMessage(
      m.chat,
      { text: text, mentions: m.mentionedJid },
      {
        userJid: conn.user.id,
        quoted: m.quoted && m.quoted.fakeObj,
      }
    );
    messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    conn.ev.emit("messages.upsert", msg);
  };

  return m;
};

exports.isUrl = (url) => {
  return url.match(
    new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
      "gi"
    )
  );
};

exports.generateProfilePicture = async (buffer) => {
  const jimp = await Jimp.read(buffer);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
  };
};

exports.baileysIs = (msg, context) => {
  return (
    !!msg?.message?.[`${context}Message`] ||
    !!msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[
      `${context}Message`
    ]
  );
};

exports.tinyurl = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      axios
        .get("https://tinyurl.com/api-create.php?url=" + url)
        .then((json) => {
          resolve(json.data);
        });
    } catch (erro) {
      return console.log(erro);
    }
  });
};
exports.upload = (inputData) => {
  return new Promise(async (resolve, reject) => {
    logger.warn("[ CONVERT ] - ToLink: Realizando upload da midia...");
    try {
      let midia;
      if (typeof inputData === "string") {
        // Caso seja uma string, presume-se que seja o caminho do arquivo.
        const fs = require("fs");
        midia = fs.readFileSync(inputData, { encoding: "base64" });
      } else if (Buffer.isBuffer(inputData)) {
        // Caso seja um Buffer, converte para base64.
        midia = inputData.toString("base64");
      } else {
        // Caso não seja string nem Buffer, espera-se que seja dado binário.
        midia = inputData;
      }

      let form = new FormData();
      form.append("file", Buffer.from(midia, "base64"), "tmp");
      await fetch("https://telegra.ph/upload", {
        method: "POST",
        body: form,
      })
        .then((html) => html.json())
        .then((post) => {
          logger.info("[ CONVERT ] - ToLink: Midia convertida com exito!");
          resolve("https://telegra.ph" + post[0].src);
        })
        .catch((erro) => reject(erro));
    } catch (erro) {
      return logger.error(
        "[ ERROR ] - convert: Ocorreu um erro ao converter a midia..."
      );
    }
  });
};
exports.getContent = (baileysMessage, type) => {
  return (
    baileysMessage.message?.[`${type}Message`] ||
    baileysMessage.message.extendedTextMessage?.contextinfo.quotedMessage?.[
      `${type}Message`
    ]
  );
};
exports.download = async (msg, fileName, context, extension) => {
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

exports.getQuotedMessage = async (message) => {
  return message?.type === "buttonsMessage"
    ? message[Object.keys(message)[1]]
    : message?.type === "templateMessage"
    ? message?.hydratedTemplate[Object.keys(message?.hydratedTemplate)[1]]
    : message?.type === "product"
    ? message[Object.keys(message)[0]]
    : message?.quoted || message;
};

exports.splitByCharacters = (str, characters) => {
  characters = characters.map((char) => (char === "\\" ? "\\\\" : char));
  const regex = new RegExp(`[${characters.join("")}]`);

  return str
    ?.split(regex)
    .map((str) => str.trim())
    .filter(Boolean);
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  logger.warn(`[ SIS ] - A: Arquivo ${__filename} foi modificado`);
  delete require.cache[file];
  require(file);
});
