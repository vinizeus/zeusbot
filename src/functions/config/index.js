const moment = require("moment-timezone");
const speed = require("performance-now");
const { performance } = require("perf_hooks");
const { PREFIXO, BOT_NAME } = require("../../config");
function runtime(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

const config = async ({ bot, msg }) => {
  const isGroup = msg.key.remoteJid.endsWith("@g.us");
  const groupMetadata = isGroup ? await bot.groupMetadata(remoteJid) : "";

  const groupName = isGroup ? groupMetadata.subject : "";
  const PREFIX = PREFIXO;
  if (msg && msg.message) {
    const type =
      Object.keys(msg.message)[0] == "senderKeyDistributionMessage"
        ? Object.keys(msg.message)[2]
        : Object.keys(msg.message)[0] == "messageContextInfo"
        ? Object.keys(msg.message)[1]
        : Object.keys(msg.message)[0];
    var body =
      type === "conversation"
        ? msg.message.conversation
        : type == "imageMessage"
        ? msg.message.imageMessage.caption
        : type == "videoMessage"
        ? msg.message.videoMessage.caption
        : type == "extendedTextMessage"
        ? msg.message.extendedTextMessage.text
        : type == "buttonsResponseMessage"
        ? msg.message.buttonsResponseMessage.selectedButtonId
        : type == "buttonsResponseMessage"
        ? msg.message.buttonsResponseMessage.selectedButtonId
        : type == "buttonsResponseMessage"
        ? msg.message.buttonsResponseMessage.selectedButtonId
        : type == "listResponseMessage"
        ? msg.message.listResponseMessage.singleSelectReply.selectedRowId
        : type == "listResponseMessage"
        ? msg.message.listResponseMessage.singleSelectReply.selectedRowId
        : type == "templateButtonReplyMessage"
        ? msg.message.templateButtonReplyMessage.selectedId
        : "";
  }
  const remoteJid = msg?.key?.remoteJid;
  let participant;
  participant
    ? msg.key.participant.includes("@")
    : (participant = msg.key.participant)
    ? msg.key.participant == undefined
    : (participant = msg.key.remoteJid);
  const splitByCharacters = (str, characters) => {
    characters = characters.map((char) => (char === "\\" ? "\\\\" : char));
    const regex = new RegExp(`[${characters.join("")}]`);

    return str
      ?.split(regex)
      .map((str) => str.trim())
      .filter(Boolean);
  };
  var t = body.trim().split(/ +/).slice(1);
  var args = splitByCharacters(t.join(" "), ["\\", "|", "/"]) || "";
  const groupActions = async (user, action) => {
    await bot.groupParticipantsUpdate(remoteJid, [user], action);
  };
  const groupSettings = async (acao) => bot.groupSettingUpdate(remoteJid, acao);
  const groupDesc = (txt) => bot.groupUpdateDescription(remoteJid, txt);
  const exit = () => bot.groupLeave(remoteJid);
  const join = async (link) => {
    await bot
      .groupAcceptInvite(link)
      .then((res) => sendReply(res))
      .catch((err) => sendReply(err));
  };
  const blockAndunBlockUser = async (user, blockOrUnblock) =>
    await bot.updateBlockStatus(user, blockOrUnblock);
  //
  // bot.public = true;
  const command = body
    .replace(PREFIX, "")
    .trim()
    .split(/ +/)
    .shift()
    .toLowerCase();

  var args = body.trim().split(/ +/).slice(1);
  args = args.concat(["", "", "", "", "", ""]);
  const pushname = msg.pushName || "Sem nome";
  const text = (q = args.join(" ").trim());
  const fatkuns = msg.quoted || msg;
  const quoted =
    fatkuns.type == "buttonsMessage"
      ? fatkuns[Object.keys(fatkuns)[1]]
      : fatkuns.type == "templateMessage"
      ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]]
      : fatkuns.type == "product"
      ? fatkuns[Object.keys(fatkuns)[0]]
      : msg.quoted
      ? msg.quoted
      : msg;
  const mime = (quoted.msg || quoted).mimetype || "";
  const qmsg = quoted.msg || quoted;
  const adivinha =
    msg.key.id.length > 21
      ? "Android ツ"
      : msg.key.id.substring(0, 2) == "3A"
      ? "IPhone ｯ"
      : "WhatsApp web シ";
  //Outras funcoes
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

  const ping = () => {
    reply("*[⚜️]Buscando dados do terminal do bot[⚜️]*");

    let timestamp = speed();
    let latensi = speed() - timestamp;
    neww = performance.now();
    oldd = performance.now();
    uptime = process.uptime();
    hora1 = moment.tz("America/Sao_Paulo").format("HH:mm:ss");
    data1 = moment.tz("America/Sao_Paulo").format("DD/MM/YY");
    bot.sendMessage(
      remoteJid,
      {
        image: {
          url: `https://eruakorl.sirv.com/Bot%20dudinha/ping.jpeg?text.0.text=VELOCIDADE%20DO%20BOT&text.0.position.gravity=north&text.0.position.y=15%25&text.0.size=40&text.0.font.family=Teko&text.0.font.weight=800&text.0.background.opacity=100&text.0.outline.blur=100&text.1.text=${latensi.toFixed(
            4
          )}&text.1.position.gravity=center&text.1.size=30&text.1.color=ffffff&text.1.font.family=Teko&text.1.font.weight=800&text.1.background.opacity=100&text.1.outline.blur=100`,
        },
        caption: `┏━━━━━━━━━━━━━━━━
  ┃
  ┃ Velocidade Do Bot + Informações
  ┃
  ┣━━━━━━━━━━━━━━━━
  ┃
  ┃ Velocidade: ${latensi.toFixed(4)}
  ┃
  ┣━━━━━━━━━━━━━━━━
  ┃ Tempo Ativo:
  ┃ [ ${runtime(process.uptime())} ]
  ┣━━━━━━━━━━━━━━━━
  ┃
  ┃ Data: ${data1}
  ┃
  ┃ ${!isGroup ? `𝑈𝑠𝑢𝑎𝑟𝑖𝑜: ${pushname}` : `𝐺𝑟𝑢𝑝𝑜: ${groupName}`}
  ┃upu
  ┃ Solicitou Comando: ${pushname}
  ┃
  ┗━━━〔 ${hora1} 〕━━━━`,
      },
      { quoted: selo }
    );
  };
  return {
    ping,
    body,
    adivinha,
    text,
    quoted,
    mime,
    qmsg,
    command,
    pushname,
    participant,
    groupActions,
    groupSettings,
    groupDesc,
    exit,
    join,
    blockAndunBlockUser,
    PREFIX,
    groupName,
    args,
  };
};

module.exports = config;
