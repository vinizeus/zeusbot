const fs = require("fs");
const path = require("path");

const logger = require("./middlewares/logger");

exports.PREFIX = "/";
exports.BOT_NAME = "Zeus~Bot";
exports.owner = ["19784214476"];
// Keys
exports.keypxd =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNjemNhdWFAZ21haWwuY29tIiwiaWF0IjoxNjk3NzYwMjMwfQ.s401cpIliWkXuixm0aej_h5ig7UISatDOdpo5U1VLX4"; // Adiquira com o Causs
exports.OPENAI_API_KEY = "SUA KEY AQUI"; //Adiquira no site da opnai
exports.ASSEMBLY_IA_KEY = "14839ec305454f989877c0f6c0806c21";
exports.TOKEN_MP =
  "APP_USR-35344857993342-011715-8a404f147af15fa8ce8ed597e6553d32-720665155";
exports.GROUP_LINK = "http://tinyurl.com/mryr8k9x";
exports.DBUSER = "Caussz";

exports.DBPASS = "UulEWMiHjbShRHkD";

// Emojis
exports.BOT_EMOJI = "🤖";

exports.ERROR_EMOJI = "❌";
exports.WAIT_EMOJI = "⏳";
exports.WARN_EMOJI = "⚠️";
exports.SUCESS_EMOJI = "✅";

exports.COMMANDS_DIR = path.join(__dirname, "commands");
exports.TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp");
exports.BOT_AUTHOR = "Causs and Brunoww";
exports.TIMEOUT_IN_MILLISECONDS_BY_EVENT = 700;
exports.BASEURL = "http://e5.est.dev.br:1056/";
exports.ASSEMBLY_URL = "https://api.assemblyai.com/v2";
exports.vihaURL = "https://vihangayt.me/";
exports.HEADERS_ASSEMBLY = {
  authorization: this.ASSEMBLY_IA_KEY,
};

var spe = [
  "🌟",
  "✨",
  "˗ˏˋ ★ ˎˊ˗",
  "☄",
  "🪐",
  "🌖",
  "🌠",
  "🛰",
  "🔭",
  "👽",
  "🎆",
  "🎇",
  "🎑",
  "✩",
  "🌙",
  "🌍",
  "🌑",
  "💫",
  "☽",
  "✧",
  "🚀",
];

exports.SPACE_EMOJIS = spe[Math.floor(Math.random() * spe.length)];
exports.response = {
  noMark: `${this.SPACE_EMOJIS} ~> *_Esse comando deve ser utilizado marcando uma mensagem..._*`,
  isGroup: `${this.SPACE_EMOJIS} ~> *_Esse comando deve ser utilizado apenas em grupos..._*`,
  isAdmins: `i${this.SPACE_EMOJIS} ~> *_Esse comando deve ser utilizado apenas por administradores..._*`,
  isBotAdmins: `${this.SPACE_EMOJIS} ~> *_Esse comando deve ser utilizado apenas quando o bot for administrador..._*`,
  isCreator: `${this.SPACE_EMOJIS} ~> *_Esse comando deve ser utilizado apenas pelos meus criadores..._*`,
  isMentionRequired: `${this.SPACE_EMOJIS} ~> *_Você deve marcar alguém para usar esse comando..._*`,
  noAntiArgs: `${this.SPACE_EMOJIS} ~> *_Esse comando precisa ser usado seguido de "on" ou "off" para funcionamento adequado_*`,
  isNsfw: `${this.SPACE_EMOJIS} ~> *_Este comando só pode ser usado quando o modo NSFW estiver ativo (permite comandos +18)_*`,
  isPremium: `${this.SPACE_EMOJIS} ~> *_Este comando só pode ser usado por usuarios premium_\n\n *Para adquirir seu plano premium vitalicio, entre em contato com meu dono, utilizando o comando ${this.PREFIX}owner*`,
  noImg: `${this.SPACE_EMOJIS} ~> *_Você precisa marcar uma imagem usando esse comando!_*`,
  isAudio: `${this.SPACE_EMOJIS} ~> *_Esse comando deve ser ultilizado marcando um audio audio..._*`,
  noGroup: `${this.SPACE_EMOJIS} ~> *_Esse comando deve ser ultilizado apenas no privado..._*`,
  userIsPrem: `${this.SPACE_EMOJIS} ~> *_Voce ja e premium..._*`,
  userIs: `${this.SPACE_EMOJIS} ~> *_Voce ja esta cadastrado..._*`,
  noUser: `${this.SPACE_EMOJIS} ~> _*Você ainda não está cadastrado!* Para se cadastrar e utilizar todos os comandos, *use o comando /rg*_\n_Ao se cadastrar você estará *concordando com todos os termos e condições de uso do ${this.BOT_NAME}. Consulte em /termos*_`,
  isSpam: `${this.SPACE_EMOJIS} ~> *_SPAM DETECTADO!_*\n_Espere para usar o comando novamente..._`,
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  logger.warn(`[ SIS ] - A: Arquivo ${__filename} foi modificado`);
  delete require.cache[file];
  require(file);
});
