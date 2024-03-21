const fs = require("fs");
const { tinyurl } = require("../functions/extras");
exports.welcome = (bot) => {


  bot.ev.on("group-participants.update", async (anu) => {

    const welcom = JSON.parse(
      fs.readFileSync("./assets/database/welcome.json")
    );
    const wkm = welcom.find((e) => e.id == anu.id);
    const antifake = JSON.parse(
      fs.readFileSync("./assets/database/antifake.json")
    );
    let metadata = await bot.groupMetadata(anu.id);

    const gpnome = metadata.subject;
    const membros = metadata.size;
    const desc = metadata.desc;
    const participant = anu.participants[0];

    let participants = anu.participants;
    for (let num of participants) {
      let ppuser;

      try {
        ppuser = await bot.profilePictureUrl(num, "image");
      } catch {
        ppuser = "https://i.ibb.co/y6nWqb5/95670d63378f7f4210f03.png";
      }

      // pega foto do grupo
      try {
        ppgroup = await bot.profilePictureUrl(anu.id, "image");
      } catch {
        ppgroup = "https://i.ibb.co/y6nWqb5/95670d63378f7f4210f03.png";
      }

        try {
          ////////////////'/////////////// CARD DE ADICIONAR/////////////////////////////////////////

          if (anu.action == "add") {
            if (antifake?.includes(anu.id) && !participant.toString().startsWith("55")) {
              bot.groupParticipantsUpdate(anu.id, [participant], "remove") && bot.sendMessage(anu.id, {
                text: `⚠️ *_Atenção! o modo anti numeros estrangeiros está atiivo, o úsuario @${participant.split("@")[0]} deve ser Banido!_* \n`
              })
            } else if (wkm?.id.includes(anu.id) && wkm.mode.includes("card")) {
            tinyurl(ppuser).then((url) => {

              let urlcard = `https://api.popcat.xyz/welcomecard?background=https://img.freepik.com/free-vector/gradient-galaxy-background_23-2148983655.jpg&text1=Bem%20vindo&text2=Ao%20Grupo:%20${gpnome}&text3=Membros%20Totais:${membros}&avatar=${url}`

            bot.sendMessage(
              anu.id,
              {
                image: {
                  url: urlcard
                },
                mentions: [participant],
                caption: ` 👋 *_Olá @${
                  participant.split("@")[0]
                }!_* \n 🌹 Seja bem vindo ao: *${gpnome}!* \n 👥 Membros Totais: ${membros} \n ❗Por favor, leia a descrição: ${desc} \n`,
              },
              { quoted: null }
            );
            })
            //////////////////////////// CARD DE REMOVER/////////////////////////////////////////
              //////////////TEXTO DE ADICIONAR/////////////////////////////////////////
            } else if (wkm?.id.includes(anu.id) && wkm.mode.includes("text")) {
              bot.sendMessage(anu.id, {
                text: ` 👋 *_Olá @${participant.split("@")[0]
                  }!_* \n 🌹 Seja bem vindo ao: *${gpnome}!* \n 👥 Membros Totais: ${membros} \n ❗Por favor, leia a descrição:\n ${desc} \n`,
                mentions: [participant],
              });
            } else if (wkm?.id.includes(anu.id) && wkm.mode.includes("image")) {
              ////////////////////IMAGEM DE ADICIONAR/////////////////////////////////////////
              bot.sendMessage(anu.id, {
                image: { url: ppuser },
                mentions: [participant],
                caption: ` 👋 *_Olá @${participant.split("@")[0]
                  }!_* \n 🌹 Seja bem vindo ao: *${gpnome}!* \n 👥 Membros Totais: ${membros} \n ❗Por favor, leia a descrição: ${desc} \n`,
              });
            }
          } else if (anu.action == "remove") {
            ///////////////CARD REMOVER
            if (wkm?.id.includes(anu.id) && wkm.mode.includes("card")) {

            tinyurl(ppuser).then((url) => {

              let urlcard = `https://api.popcat.xyz/welcomecard?background=https://img.freepik.com/free-vector/gradient-galaxy-background_23-2148983655.jpg&text1=Adeus&text2=Um%20membro%20saiu%20de:%20${gpnome}&text3=Membros%20Totais:${membros}&avatar=${url}`

              bot.sendMessage(anu.id, {
              image: {
                  url: urlcard
              },
              mentions: [participant],
              caption: `ixi...🥲 \nO membro @${
                participant.split("@")[0]
              } saiu... \n\n Já vai tarde trouxa kkkkk`,
            });
            })

            } else if (wkm?.id.includes(anu.id) && wkm.mode.includes("text")) {

                ////////////////////TEXTO DE REMOVER/////////////////////////////////////////

                bot.sendMessage(anu.id, {
                  text: `ixi...🥲 \nO membro @${
                    participant.split("@")[0]
                  } saiu... \n\n Já vai tarde trouxa kkkkk`,
                  mentions: [participant],
                });
            } else if (wkm?.id.includes(anu.id) && wkm.mode.includes("image")) {
              ////////////////////IMAGEM DE REMOVER/////////////////////////////////////////
                bot.sendMessage(anu.id, {
                  image: { url: ppuser },
                  mentions: [participant],
                  caption: `ixi...🥲 \nO membro @${
                    participant.split("@")[0]
                  } saiu... \n\n Já vai tarde trouxa kkkkk`,
                });
            }
          } else if (anu.action == "promote") {
            ////////////////////TEXTO DE PROMOVER/////////////////////////////////////////

            bot.sendMessage(anu.id, {
              text: ` Parabéns @${
                num.split("@")[0]
              }!!\n Você reecebeu o cargo de administrador em ${gpnome}`,
              mentions: [num],
            });
          } else if (anu.action == "demote") {
            ////////////////////TEXTO DE REBAIXAR/////////////////////////////////////////
            bot.sendMessage(anu.id, {
              text: `Xii...\n O @${num.split("@")[0]} foi rebaixado em ${
                metadata.subject
              }.`,
              mentions: [num],
            });
          }
        } catch (err) {
          console.log(err)
        }
    }
  }
  )
}

