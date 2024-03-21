const fs = require("fs");

const logger = require("./src/middlewares/logger");

const { response } = require("./src/config");

const autoText = JSON.parse(fs.readFileSync("./assets/database/autotext.json"));
const autoSticker = JSON.parse(
  fs.readFileSync("./assets/database/autoSticker.json")
);
const antilink = JSON.parse(fs.readFileSync("./assets/database/antilink.json"));
const antifake = JSON.parse(fs.readFileSync("./assets/database/antifake.json"));
const modoSimi = JSON.parse(fs.readFileSync("./assets/database/modosimi.json"));
const admmode = JSON.parse(fs.readFileSync("./assets/database/admmode.json"));
const nsfw = JSON.parse(fs.readFileSync("./assets/database/nsfw.json"));

function onReadyJson(
  command,
  param,
  remote,
  isGroup,
  isAdmins,
  isBotAdmins,
  isOn,
  callback
) {
  if (!isGroup) return callback(response.isGroup);
  if (!isAdmins) return callback(response.isAdmins);
  if (!isBotAdmins) return callback(response.isBotAdmins);

  try {
    if (param === "on") {
      if (isOn) return callback(`O ${command} já estava ativo! 🤦`);
      command.push(remote);
      fs.writeFileSync(
        "./assets/database/antilink.json",
        JSON.stringify(command)
      );
      callback(`O ${command} foi ativado com sucesso 😎`);
    } else if (param === "off") {
      if (!isOn) return callback("Já está desativado");
      const index = command.indexOf(remote);
      if (index !== -1) {
        command.splice(index, 1);
        fs.writeFileSync(
          `./assets/database/${command}.json`,
          JSON.stringify(command)
        );
        callback(`O ${command} foi desativado 🤝`);
      }
    }
  } catch (error) {}
}

onReadyJson(autoText, "on", "teste", true, true, true, false, console.log);
