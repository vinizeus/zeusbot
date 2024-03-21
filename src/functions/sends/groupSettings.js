const fs = require("fs");
const { sendsWithBot } = require("./sends");

const { splitByCharacters } = require("../extras");

exports.updateGroup = (bot, msg) => {
  if (msg && msg?.message) {
    const type =
      Object.keys(msg?.message)[0] == "senderKeyDistributionMessage"
        ? Object.keys(msg?.message)[2]
        : Object.keys(msg?.message)[0] == "messageContextInfo"
        ? Object.keys(msg?.message)[1]
        : Object.keys(msg?.message)[0];

    var body =
      type === "conversation"
        ? msg?.message?.conversation
        : type == "imageMessage"
        ? msg?.message?.imageMessage?.caption
        : type == "videoMessage"
        ? msg?.message?.videoMessage?.caption
        : type == "extendedTextMessage"
        ? msg?.message?.extendedTextMessage?.text
        : type == "buttonsResponseMessage"
        ? msg?.message?.buttonsResponseMessage?.selectedButtonId
        : type == "buttonsResponseMessage"
        ? msg?.message?.buttonsResponseMessage?.selectedButtonId
        : type == "buttonsResponseMessage"
        ? msg?.message?.buttonsResponseMessage?.selectedButtonId
        : type == "listResponseMessage"
        ? msg?.message?.listResponseMessage?.singleSelectReply?.selectedRowId
        : type == "listResponseMessage"
        ? msg?.message?.listResponseMessage?.singleSelectReply?.selectedRowId
        : type == "templateButtonReplyMessage"
        ? msg?.message?.templateButtonReplyMessage?.selectedId
        : "";
  }

  const textOnly = body.trim().split(/ +/).slice(1);
  const args = splitByCharacters(textOnly.join(" "), ["\\", "|", "/"]) || "";

  const b = sendsWithBot(bot, msg);

  const autoText = JSON.parse(
    fs.readFileSync("./assets/database/autotext.json")
  );
  const autoSticker = JSON.parse(
    fs.readFileSync("./assets/database/autoSticker.json")
  );
  const antilink = JSON.parse(
    fs.readFileSync("./assets/database/antilink.json")
  );
  const antilinkHard = JSON.parse(
    fs.readFileSync("./assets/database/antilinkHard.json")
  );
  const antifake = JSON.parse(
    fs.readFileSync("./assets/database/antifake.json")
  );
  const modoSimi = JSON.parse(
    fs.readFileSync("./assets/database/modosimi.json")
  );
  const admmode = JSON.parse(fs.readFileSync("./assets/database/admmode.json"));
  const welcome = JSON.parse(fs.readFileSync("./assets/database/welcome.json"));
  const premium = JSON.parse(fs.readFileSync("./assets/database/premium.json"));
  const nsfw = JSON.parse(fs.readFileSync("./assets/database/nsfw.json"));
  const ban = JSON.parse(fs.readFileSync("./assets/database/ban.json"));
  const bangp = JSON.parse(fs.readFileSync("./assets/database/bangp.json"));
  const remoteJid = msg?.key?.remoteJid;
  const Isme = msg?.key?.fromMe;
  const isGroup = msg?.key?.remoteJid.endsWith("@g.us");

  const wkm = welcome.find((e) => e.id == remoteJid);
  const link = antilink.find((e) => e.id == remoteJid);

  const isMentionRequired =
    msg?.message?.extendedTextMessage === undefined ||
    msg?.message?.extendedTextMessage === null;

  const userMentioned =
    msg?.message?.extendedTextMessage?.contextInfo?.participant ||
    msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid[0];

  const groupMetadata = async () =>
    isGroup ? await bot.groupMetadata(remoteJid) : "";
  const participant = isGroup
    ? msg.key.participant.includes("@")
      ? msg.key.participant.split("@")[0] + "@s.whatsapp.net"
      : msg.key.participant
    : msg.key.remoteJid;

  const isNsfw = isGroup ? nsfw.includes(remoteJid) : false;
  const isWelcome = isGroup ? wkm?.id?.includes(remoteJid) : false;
  const isPremium = isGroup ? premium.includes(userMentioned) : false;
  const isBan = isGroup ? ban.includes(participant) : false;
  const isBangp = isGroup ? bangp.includes(remoteJid) : false;
  const isAntiLink = isGroup ? link?.id?.includes(remoteJid) : false;
  const isAntiLinkHard =
    isGroup && link?.id?.includes(remoteJid)
      ? link?.mode === "linkhard"
      : false;
  const isAntifake = isGroup ? antifake.includes(remoteJid) : false;
  const isAdmmode = isGroup ? admmode.includes(remoteJid) : false;
  const isAutotext = isGroup ? autoText.includes(remoteJid) : false;
  const isAutoSticker = isGroup ? autoSticker.includes(remoteJid) : false;
  const ismodoSimi = isGroup ? modoSimi.includes(remoteJid) : false;
  const participants = async () =>
    isGroup ? await groupMetadata.participants : "";
  const groupAdmins = async () =>
    isGroup
      ? await participants.filter((v) => v.admin !== null).map((v) => v.id)
      : "";

  const isAdmins = async () =>
    isGroup ? await groupAdmins.includes(participant) : false;

  const groupName = isGroup ? groupMetadata.subject : "Evo Grupo";

  return {
    async groupActions(user, action) {
      await bot.groupParticipantsUpdate(remoteJid, [user], action);
    },

    async groupSettings(acao) {
      await bot.groupSettingUpdate(remoteJid, acao);
    },

    async groupDesc(txt) {
      await bot.groupUpdateDescription(remoteJid, txt);
    },

    async exit() {
      await bot.groupLeave(remoteJid);
    },
    async blockAndunBlockUser(user, blockOrUnblock) {
      await bot.updateBlockStatus(user, blockOrUnblock);
    },

    async join(link) {
      await bot
        .groupAcceptInvite(link)
        .then((res) =>
          b.sendText(`*_Bot entrou no grupo com sucesso!_*\n_id_: ${res}`)
        )
        .catch((err) => b.sendOwnerError(err));
    },

    isAdmmode,
    isAntiLink,
    isAntifake,
    isAutoSticker,
    isAutotext,
    isBan,
    isBangp,
    isGroup,
    isNsfw,
    isPremium,
    isWelcome,
    ismodoSimi,
    autoText,
    admmode,
    antifake,
    antilink,
    autoSticker,
    ban,
    bangp,
    modoSimi,
    nsfw,
    welcome,
    participant,
    groupMetadata,
    groupName,
    isMentionRequired,
    userMentioned,
    premium,
    isAntiLink,
    antilink,
    isAntiLinkHard,
    antilinkHard,
    isAdmins,
    body,
    args,
    Isme,
    remoteJid,
  };
};
