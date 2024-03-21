const fs = require("fs");
const moment = require("moment");

const logger = require("../../../middlewares/logger");

let premium = [];
try {
  premium = JSON.parse(fs.readFileSync("./assets/database/premium.json"));
} catch (error) {
  logger.error(
    "[ ERROR ] - CRIT: Erro ao carregar a lista de usuários premium:",
    error
  );
}

function addPremiumUser(user, callback) {
  const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
  //   if (premium.includes(user)) {
  //     throw new Error(`O usuario (${user}) ja é premium.`);
  //   }

  if (premium.some((entry) => entry.user === user)) {
    throw new Error(`O usuário (${user}) já é premium.`);
  }

  const startDate = moment().format();
  const expirationDate = moment(startDate).add(30, "days").format("YYYY-MM-DD");
  premium.push({ user, startDate });
  const message =
    `🎉 _*Premium Ativado*_ 🎉\n\n` +
    `_Usuário: *${user}*_\n` +
    `_Data de Compra: *${currentDate}*_\n` +
    `_Data de Expiração: *${expirationDate}*_\n` +
    `_Total de Usuários Premium: *${premium.length}*_`;

  callback(message);
  logger.info(
    `[ PREM ] - SUCESS: O usuario (${user}) foi adicionado com sucesso`
  );

  try {
    fs.writeFileSync(
      "./assets/database/premium.json",
      JSON.stringify(premium, null, 2)
    );
  } catch (error) {
    logger.error(
      "[ ERROR ] - CRIT: Erro ao salvar a lista de usuários premium:",
      error
    );
  }
}

function removeExpiredPremiumUsers(callback, callback2) {
  const currentDate = moment();
  const usersToRemove = [];

  premium.forEach((userObj, index) => {
    const startDate = moment(userObj.startDate);
    const daysDiff = currentDate.diff(startDate, "days");

    if (daysDiff >= 30) {
      usersToRemove.push(index);
    }
  });

  if (usersToRemove.length > 0) {
    usersToRemove.reverse().forEach((index) => {
      const removedUser = premium.splice(index, 1)[0];
      logger.warn(
        `[ PREM ] - REMOVE: O premium do usuário (${removedUser.user}) expirou.`
      );
      callback(
        `⚠ _*Premium Expirado*_ ⚠\n\n_Usuário: _${removedUser.user}*_\n_Data de expiração: *${currentDate}*_\n\n_Mensagem de renovação enviada..._`
      );
      callback2(
        removedUser.user,
        `⚠️ *_Aviso Premium Expirado_* ⚠️\n\n_Seu status *Premium expirou.*_ 😔\n_Para renovar o Premium e continuar desfrutando de recursos exclusivos, basta *digitar o comando /toprem* novamente..._ 🚀`
      );
    });

    try {
      fs.writeFileSync(
        "./assets/database/premium.json",
        JSON.stringify(premium, null, 2)
      );
    } catch (error) {
      console.error("Erro ao salvar a lista de usuários premium:", error);
    }
  }
}

module.exports = {
  addPremiumUser,
  removeExpiredPremiumUsers,
};
