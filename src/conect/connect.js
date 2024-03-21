const { owner, BOT_NAME } = require("../config");
const {
  default: botConnect,
  useMultiFileAuthState,
  DisconnectReason,
  makeInMemoryStore,
} = require("@whiskeysockets/baileys");

const logger = require("../middlewares/logger");

const os = require("os");
const pino = require("pino");
const { Boom } = require("@hapi/boom");

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

function getDeviceInfo(bot) {
  const hostname = os.hostname();
  const ip = getIpAddress();
  const platform = os.platform();
  const arch = os.arch();
  const totalMemory = formatBytes(os.totalmem());
  const freeMemory = formatBytes(os.freemem());

  return `_*New ${BOT_NAME} conectado!*_\n-> _Nome: ${bot.user.name}_\n-> _Numero: ${bot.user.id.split("@")[0]}_\n-> _Hostname: ${hostname}_\n-> _Endereço IP: ${ip}_\n-> _Plataforma: ${platform}_\n-> _Arquitetura: ${arch}_\n-> _RAM Total: ${totalMemory}_\n-> _RAM Livre: ${freeMemory}_`;
}

function getIpAddress() {
  const ifaces = os.networkInterfaces();
  for (const iface in ifaces) {
    const ifaceInfo = ifaces[iface];
    for (const addrInfo of ifaceInfo) {
      if (addrInfo.family === "IPv4" && !addrInfo.internal) {
        return addrInfo.address;
      }
    }
  }
  return "N/A";
}

// Função para formatar bytes
function formatBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

async function connect() {
  try {
    // Aqui, o código para obter os argumentos da linha de comando foi removido.

    const { state, saveCreds } = await useMultiFileAuthState(`./assets/conect`);

    const bot = botConnect({
      logger: pino({ level: "silent" }),
      printQRInTerminal: true,
      browser: [`${BOT_NAME}`, "Safari", "1.0.0"],
      auth: state,
      defaultQueryTimeoutMs: undefined,
      getMessage: async (key) => {
        if (store) {
          const msg = await store.loadMessage(key.remoteJid, key.id);
          return msg.message || undefined;
        }
        return {
          conversation: `Olá! Me chamo ${BOT_NAME}!`,
        };
      },
    });

    store.bind(bot.ev);

    bot.serializeM = (msg) => smsg(bot, msg, store);

    bot.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        switch (reason) {
          case DisconnectReason.badSession:
            logger.error(
              "Arquivo de sessão inválido, exclua a sessão e verifique novamente"
            );
            bot.logout();
            break;
          case DisconnectReason.connectionClosed:
          case DisconnectReason.connectionLost:
          case DisconnectReason.restartRequired:
          case DisconnectReason.timedOut:
            logger.warn("Conexão encerrada, tentando reconectar...");
            await reconnect();
            break;
          case DisconnectReason.connectionReplaced:
            logger.warn(
              "Conexão substituída, nova sessão aberta, feche a sessão atual para ultilizar"
            );

            bot.logout();
            break;
          case DisconnectReason.loggedOut:
            logger.warn(
              "Dispositivo desconectado, verifique novamente e execute."
            );
            bot.logout();
            break;
          case DisconnectReason.Multidevicemismatch:
            logger.error("Erro, escaneie novamente");
            bot.logout();
            break;
          default:
            bot.end(
              `Motivo Desconectado Desconhecido: ${reason}|${connection}`
            );
        }
      }
      if (
        update.connection === "open" ||
        update.receivedPendingNotifications === "true"
      ) {
        const deviceInfo = getDeviceInfo(bot);
        for (const dono of owner) {
          await bot.sendMessage(`${dono}@s.whatsapp.net`, {
            poll: {
              name: `*New ${BOT_NAME} iniciado!*\n${deviceInfo}`,
              values: ["Get JSON Connect", "Del JSON Connect"],
              selectableCount: 1,
            },
          });
        }

        logger.info(
          `New ${BOT_NAME} conectado!\n-> Nome: ${bot.user.name}\n-> Numero: ${bot.user.id}`
        );
      }
    });

    bot.ev.on("creds.update", saveCreds);
    return bot;
  } catch (error) {
    logger.fatal("Ocorreu um erro ao conectar:", error.message);
    throw error;
  }
}

async function reconnect() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  logger.warn("Tentando reconectar...");
  await connect();
}

module.exports = {
  store,
  connect,
};
