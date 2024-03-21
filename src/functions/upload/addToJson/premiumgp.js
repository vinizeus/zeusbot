const fs = require("fs");
const moment = require("moment");

const logger = require("../../../middlewares/logger");

let premium = [];
try {
  premium = JSON.parse(fs.readFileSync("./assets/database/premiumgp.json"));
} catch (error) {
  logger.error(
    "[ ERROR ] - CRIT: Erro ao carregar a lista de grupos premium:",
    error
  );
}

function addPremiumGroup(group, callback) {
  const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
  //   if (premium.includes(group)) {
  //     throw new Error(`O usuario (${group}) ja é premium.`);
  //   }

  if (premium.some((entry) => entry.group === group)) {
    throw new Error(`O grupo (${group}) já é premium.`);
  }

  const startDate = moment().format();
  const expirationDate = moment(startDate).add(30, "days").format("YYYY-MM-DD");
  premium.push({ group, startDate });
  const message =
    `🎉 _*Premium Ativado*_ 🎉\n\n` +
    `_grupo: *${group}*_\n` +
    `_Data de Compra: *${currentDate}*_\n` +
    `_Data de Expiração: *${expirationDate}*_\n` +
    `_Total de grupos Premium: *${premium.length}*_`;

  callback(message);
  logger.info(
    `[ PREM ] - SUCESS: O grupo s(${group}) foi adicionado com sucesso`
  );

  try {
    fs.writeFileSync(
      "./assets/database/premiumgp.json",
      JSON.stringify(premium, null, 2)
    );
  } catch (error) {
    logger.error(
      "[ ERROR ] - CRIT: Erro ao salvar a lista de grupos premium:",
      error
    );
  }
}

function removeExpiredPremiumGroups(g, callback, callback2) {
  const currentDate = moment();
  const groupsToRemove = [];

  premium.forEach((groupObj, index) => {
    const startDate = moment(groupObj.startDate);
    const daysDiff = currentDate.diff(startDate, "days");

    if (daysDiff >= 30) {
      groupsToRemove.push(index);
    }
  });

  if (groupsToRemove.length > 0) {
    groupsToRemove.reverse().forEach((index) => {
      const removedGroup = premium.splice(index, 1)[0];
      logger.warn(
        `[ PREM ] - REMOVE: O premium do grupo (${removedGroup.group}) expirou.`
      );
      callback(
        `⚠ _*Premium Expirado*_ ⚠\n\n_grupo: _${removedGroup.group}*_\n_Data de expiração: *${currentDate}*_\n\n_Mensagem de renovação enviada..._`
      );
      callback2(
        removedGroup.group,
        `⚠️ *_Aviso Premium Expirado_* ⚠️\n\n_Seu status *Premium expirou.*_ 😔\n_Para renovar o Premium e continuar desfrutando de recursos exclusivos, basta *digitar o comando /aluguel* novamente..._ 🚀`
      );
    });

    try {
      fs.writeFileSync(
        "./assets/database/premiumgp.json",
        JSON.stringify(premium, null, 2)
      );

    } catch (error) {
      console.error("Erro ao salvar a lista de grupos premium:", error);
    }
  }

  // g.exit() //desativar quando usar ni pessoal
}

module.exports = {
  addPremiumGroup,
  removeExpiredPremiumGroups,
};
