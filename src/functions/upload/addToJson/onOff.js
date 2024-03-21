const fs = require("fs");

const logger = require("../../../middlewares/logger");

const { response } = require("../../../config");

const { sendsWithBot } = require("../../sends/sends");
const { updateGroup } = require("../../sends/groupSettings");

function onReadyJson(bot, msg, command, remote, groupName) {
  const b = sendsWithBot(bot, msg);
  const g = updateGroup(bot, msg);

  if (!g.isGroup) {
    return b.sendWarningReply(response.isGroup);
  }

  if (!g.isAdmins) {
    return b.sendWarningReply(response.isAdmins);
  }

  // if (!g.isBotAdmins) {
  //   return b.sendErrorReply(response.isBotAdmins);
  // }

  try {
    let data = null;
    const filePath = `./assets/database/${command}.json`;

    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath));
    } else {
      data = [];
    }

    if (g.args.join(" ") === "on") {
      // if (isOn) {
      //   return b.sendErrorReply(`O ${command} já está ativo! 🤦`);
      // }

      if (!data.includes(remote)) {
        data.push(remote);
      }

      fs.writeFileSync(filePath, JSON.stringify(data));
      b.sendSuccessReply(
        `_*${command}*_: *[${g.args.join(" ")}]* _no grupo ${groupName}_`
      );
      logger.warn(
        `[ GROUP ] - Activate: modo de ${command} ativado com sucesso`
      );
    } else if (g.args.join(" ") === "off") {
      // if (!isOn) {
      //   return b.sendErrorReply(`O ${command} já está desativado.`);
      // }

      const index = data.indexOf(remote);
      if (index !== -1) {
        data.splice(index, 1);
        fs.writeFileSync(filePath, JSON.stringify(data));
        b.sendSuccessReply(
          `_*${command}*_: *[${g.args.join(" ")}]* _no grupo ${groupName}_`
        );
        logger.warn(
          `[ GROUP ] - Activate: modo de ${command} desativado com sucesso`
        );
      }
    }
  } catch (error) {
    logger.error(
      `[ ERROR ] - Ocorreu um erro no comando "${command}":\n${error}`
    );
    b.sendOwnerError(error.message);
  }
}

module.exports = onReadyJson;
