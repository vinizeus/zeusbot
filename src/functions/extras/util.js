const archiver = require("archiver");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");
const { writeFile } = require("fs/promises");
const path = require("path");

const { TEMP_DIR } = require("../../config");

const upload = async (inputData) => {
  try {
    const midia =
      typeof inputData === "string"
        ? fs.readFileSync(inputData, { encoding: "base64" })
        : Buffer.isBuffer(inputData)
        ? inputData.toString("base64")
        : inputData;

    const form = new FormData();
    form.append("file", Buffer.from(midia, "base64"), "tmp");

    const response = await fetch("https://telegra.ph/upload", {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer o upload da mídia");
    }

    const post = await response.json();
    return "https://telegra.ph" + post[0].src;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getContent = (msg, type) => {
  return (
    msg.message?.[`${type}Message`] ||
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[
      `${type}Message`
    ]
  );
};

const download = async (msg, fileName, context, extension) => {
  const content = await getContent(msg, context);

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

function createZipFolder(folderPath, zipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      resolve(zipPath);
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();
  });
}

function getQuotedMessage(message) {
  return message?.type === "buttonsMessage"
    ? message[Object.keys(message)[1]]
    : message?.type === "templateMessage"
    ? message?.hydratedTemplate[Object.keys(message?.hydratedTemplate)[1]]
    : message?.type === "product"
    ? message[Object.keys(message)[0]]
    : message?.quoted || message;
}

module.exports = {
  upload,
  getContent,
  download,
  createZipFolder,
  getQuotedMessage,
};
