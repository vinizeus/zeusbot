const axios = require("axios");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const yts = require("yt-search");


const logger = require("../middlewares/logger");

const { payment } = require("../middlewares/payment/pix");

const Usuario = require("../../models/user");

const {
  adminMenu, dlMenu, gameMenu, ownerMenu, papelparede, efeitos2Menu, efeitosMenu, funMenu, futMenu, guia, iaMenu, logos2Menu, logosMenu, memes2Menu, memes3Menu, memes4Menu, memesMenu, menuMessage, modelosMenu, nsfwMenu, premiumMenu, searchMenu, soundmenu, toolsMenu, waitMessage
} = require("../menu");

const { audioTotext, onReadyJson,
  queryBy, upload, createZipFolder,
  frutas, addPremiumUser, baileysIs,
  removeExpiredPremiumUsers, addPremiumGroup,
  removeExpiredPremiumGroups, getQuotedMessage,
  splitByCharacters, isSpam, addFilter } = require('../functions');

const {
  downloadAudio, downloadImage,
  downloadSticker, downloadVideo,
} = require("../functions/downoad/downloadMedia");

const {
  BASEURL, vihaURL,
  PREFIX, BOT_NAME,
  GROUP_LINK, CONTACT_INFO,
  TOKEN_MP, owner,
  TEMP_DIR, response,
} = require("../config");

const { sendsWithBot } = require("../functions/sends/sends");
const { reactWithBot } = require("../functions/sends/reacts");
const { updateGroup } = require("../functions/sends/groupSettings");
const { sendMedia } = require("../functions/sends/sendMedia");

module.exports = bot = async (bot, msg, chatUpdate, store) => {
  const b = sendsWithBot(bot, msg); // Send convencional
  const g = updateGroup(bot, msg); // atua;izacoes de grupo
  const m = sendMedia(bot, msg); // send de midia
  const r = reactWithBot(bot, msg); // Send reacoes

  const remoteJid = msg?.key?.remoteJid;
  const fatkuns = msg.quoted || msg;
  const isGroup = msg?.key?.remoteJid.endsWith("@g.us");
  const quoted = getQuotedMessage(fatkuns);

  const groupMetadata = g.isGroup ? await bot.groupMetadata(g.remoteJid) : "";

  const groupName = g.isGroup ? groupMetadata.subject : `${BOT_NAME} Grupo`;

  const isImage = baileysIs(msg, "image");
  const isVideo = baileysIs(msg, "video");
  const isSticker = baileysIs(msg, "sticker");
  const isAudio = baileysIs(msg, "audio");

  bot.public = true
  const bodyLower = g.body.toLowerCase();

  // Verifica se a mensagem começa com o prefixo e extrai o comando
  const command = bodyLower.startsWith(PREFIX)
    ? bodyLower.slice(PREFIX.length).trim().split(/ +/).shift()
    : null;

  const textOnly = g.body.trim().split(/ +/).slice(1);
  const args = splitByCharacters(textOnly.join(" "), ["\\", "|", "/"]) || "";

  const pushname = msg.pushName || "Joao Gabriel";
  const text = (q = args.join(" ").trim());
  const mime = (quoted.msg || quoted).mimetype || "";

  const isCmd = g.body.startsWith(PREFIX);

  // log dos comandos

  if (isCmd && isGroup) {
    logger.info(`[ C: ${command} ] - De ${pushname} em ${groupName}`);
  }

  if (!isGroup && isCmd) {
    logger.info(`[ C: ${command} ] - De ${pushname} no privado`);
  }

  const ppuser = await (async () => {
    return await bot.profilePictureUrl(g.participant, "image");
  })().catch(() => "https://i.ibb.co/SmsqvsH/95670d63378f7f4210f03.png");

  const participants = isGroup ? await groupMetadata.participants : "";

  const groupAdmins = isGroup
    ? await participants.filter((v) => v.admin !== null).map((v) => v.id)
    : "";
  const isAdmins = isGroup ? groupAdmins.includes(g.participant) : false;
  const botNumber = bot.user?.id.split(":")[0] + "@s.whatsapp.net";
  const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
  const isCreator = [botNumber.split("@")[0], ...owner].includes(
    g.participant.split("@")[0]
  );

  const isMedia = /image|video|sticker|audio/.test(mime);

  const startTime = Date.now();
  const user = await Usuario.findOne({ numeroTelefone: remoteJid }, "-senha");

  //antispam
  if (isCmd && isSpam(remoteJid) && !isGroup) {
    logger.warn(`[ SPAM ] - Flood: Comando ignorado!`);
    return b.sendReply(response.isSpam);
  }
  if (isCmd && isSpam(remoteJid) && isGroup) {
    logger.warn(`[ SPAM ] - Flood: Comando ignorado!`);
    return b.sendReply(response.isSpam);
  }

  ///////////////////Modo Adm//////////////////////
  if ((g.isAdmmode && !isAdmins) || (g.isBan && !isCreator)) return;

  /////////////////
  if (!isCreator && g.isBangp) return;

  
  //removeExpiredPremiumGroups(g, b.sendOwnerMessage, b.sendUser);

  const userName = user?.nome;
  const userNumber = user?.numeroTelefone;

  const userPhoto = user?.ppuser;
  const userId = user?.id;
  const isUserNsfw = user?.nsfw;
  const isUserPrem = user?.premium;
  const userLevel = user?.level;
  const userCash = user?.saldo;


  async function downloadWithAxios(url, filename) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    fs.writeFile(filename, response.data, (err) => {
      if (err) throw err;
      console.log('Image downloaded successfully!');
    });
  }


  switch (command) {
    case "botgp":
      b.sendReply("https://chat.whatsapp.com/K1wIUcG9lTH7I4hq0HFsQw")
      break
    case 'guia':
      {
        b.sendReply(guia)
      }
      break
    case 'exemple':
      if (!user) return b.sendWarningReply(response.noUser);
      b.sendReply('exemplo de case com validacao de usuario e antispam');
      addFilter(remoteJid);
      break

    case "zombie":
    case "remini":
    case "toanime":
    case "toanime2":
    case "tocartoon":
    case "sketch":
      {
        if (!isImage) return b.sendReply(response.noImg);
        b.sendWaitReply()
        try {

          const inputPath = await downloadImage(msg, "input");
          const imagetoLink = await upload(inputPath);

          // Efeito de blur aplicado
          const blurredImageLink = `${BASEURL}imgmaker/${command}/?url=${imagetoLink}`;

          m.image(
            blurredImageLink,
            `🖼️ _Aqui está sua imagem com efeito *${command}*, ${pushname}!_`
          );
        } catch (err) {
          console.log(err);
        }
      }
      break
    case "removebg":
      {
        if (!isImage) return b.sendReply(response.noImg);
        b.sendWaitReply()
        try {

          const inputPath = await downloadImage(msg, "input");
          const imagetoLink = await upload(inputPath);

          // Efeito de blur aplicado
          const blurredImageLink = `${BASEURL}ia/${command}/?img=${imagetoLink}`;

          m.image(
            blurredImageLink,
            `🖼️ _Aqui está sua imagem com efeito *${command}*, ${pushname}!_`
          );
        } catch (err) {
          console.log(err);
        }
      }
      break
    case "fakeface": {
      m.image(`${BASEURL}work/fakeface`, "Essa pessoa não exitse.")
    }
      break
    case "tts":
      if (!args.join("")) return b.sendText(response.noText);
      axios.get(
        `${BASEURL}work/tts/?text=${text}`
      ).then((res) => {
        m.audio(res.data)
      })
      break;
    case "anonovo":
    case "fatoinutil":
      axios.get(
        `${BASEURL}work/${command}`
      ).then(async (res) => {
        await b.sendReply(res.data)
      })
      break;
    case "insulto":
      axios.get(
        `${BASEURL}work/insulto`
      ).then((res) => {
        b.sendReply(res.data)
      })
      break;
    case "ocr": {
      if (!isImage) return b.sendReply(response.noImg);
      const inputPath = await downloadImage(msg, "input");
      const imagetoLink = await upload(inputPath);
      axios.get(`${BASEURL}work/ocr/?img=${imagetoLink}`).then((res) => {
        m.sendReply(res.data.result)
      }).catch((e) => {
        b.sendReply(e);
        b.sendOwnerError(e);
      })
    }

      break
    case "pinterest": {
      if (!args.join(" ")) return b.sendReply("digite o termo que você deseja buscar no pinterest...");
      axios.get(`${BASEURL}search/pinterest/?text=${args.join(" ")}`).then((res) => {
        m.image(res.data.img)
      })

    }
      break
    case "cep": {
      if (!args.join(" ")) return b.sendReply("digite o cep que você deseja buscar...");

      axios.get(`${BASEURL}search/cep/?cep=${args.join(" ")}`).then((res) => {
        b.sendReply("\n  *CEP ENCONTRADO!*\n" + `*CEP* ` + res.data.cep + "\n" + res.data.logradouro + "\n" + res.data.bairro + "\n" + `DDD` + res.data.cidade.ddd + "\n" + res.data.cidade.nome + "\n" + res.data.estado.sigla)
      })
    }
      break
    case "animebyframe": {
      if (!isImage) return b.sendReply(response.noImg);

      const inputPath = await downloadImage(msg, "input");
      const imagetoLink = await upload(inputPath);
      axios.get(`${BASEURL}search/animebyframe/?img=${imagetoLink}`).then((res) => {
        let resp = res.data.result[0]
        m.video(resp.video, `🔎 _Resultado encontrado!_\n ✍️ *Nome:* ${resp.filename}\n  📺 *Episódio:* ${resp.episode} \n ⏳ *Tempo:* ${(resp.from / 60).toFixed(2)}min - ${(resp.to / 60).toFixed(2)}min\n ♊ *Semelhança:* ${(resp.similarity * 100).toFixed(2)}%`)
      }).catch((e) => {
        b.sendReply(e);
        b.sendOwnerError(e);
      })
    }
      break
    case "ibge": {
      axios.get(`${BASEURL}news/ibge`).then((res) => {
        let resp = res.data.items[Math.floor(Math.random() * res.data.items.length)]
        b.sendReply(`*${resp.titulo}*\n\n${resp.introducao}\n\n*Data:* ${resp.data_publicacao} \n\n*Link:* ${resp.link}`)
      }).catch((e) => {
        b.sendReply(e);
        b.sendOwnerError(e);
      })
    }
      break
    case "vagalume": {
      axios.get(`${BASEURL}news/vagalume`).then((res) => {
        let resp = res.data.news[Math.floor(Math.random() * res.data.news.length)]
        m.image("https://www.vagalume.com.br" + resp.pic_src, `*${resp.headline}*\n${resp.kicker}. ${resp.featured} \n\n*Data:* ${resp.inserted} \n\n*Link:* ${resp.url}`)
      }).catch((e) => {
        b.sendReply(e);
        b.sendOwnerError(e);
      })
    }
      break
    case "futnews": {
      axios.get(`${BASEURL}fut/noticias`).then((res) => {
        let resp = res.data.DATA[Math.floor(Math.random() * res.data.DATA.length)].ARTICLE
        m.image(resp.IMAGES[0].URL, `*${resp.TITLE}*\n\n*Créditos:* ${resp.IMAGES[0].CREDIT}`)
      }).catch((e) => {
        b.sendReply(e);
        b.sendOwnerError(e);
      })
    }

      break
    case "estadio": {
      axios.get(`${BASEURL}fut/estadios`).then((res) => {
        let resp = res.data.response[Math.floor(Math.random() * res.data.response.length)]
        m.image(resp.image, `*${resp.name}*\n\n*Endereço:* ${resp.address}\n *Cidade:* ${resp.city} \n*País:* ${resp.country}\n *Capacidade:* ${resp.capacity}*\n `)
      }).catch((e) => {
        b.sendReply(e);
        b.sendOwnerError(e);
      })
    }

      break
    //futebol 

    case "rankingfifa": {
      axios.get(`${BASEURL}fut/ranking/fifa`).then((res) => {
        arr = []
        const data = res.data.data.teams.map((ranking) => {
          arr.push(`*Este é o Ranking da FIFA em ordem cronológica.*\n\n*Posição:* ${ranking.rank}\n*Nome:* ${ranking.countryName}\nConfederação: ${ranking.confederation} *Pontos:* ${ranking.totalPoints}`)
        });
        b.sendReply(arr.join("\n\n"))
      });

    }

      break
    case "partidas": {
      axios.get(`${BASEURL}fut/partidas`).then((res) => {
        arr = []
        const data = res.data.result.map((ranking) => {
          arr.push(`\n*Casa:* ${ranking.teamA.name}\n*Fora:* ${ranking.teamB.name}\nCompetição: ${ranking.championship.name}\n *Status:* ${ranking.status} \n *Minuto:* ${ranking.timer}\n Resultado: ${ranking.teamA.score.f} x ${ranking.teamB.score.f}\n`)
        });
        b.sendReply(`*Estas são as partidas de hoje.* ` + arr.join(" "))
      });
    }
      break
    case "aovivo": {
      axios.get(`${BASEURL}fut/aovivo`).then((res) => {
        arr = []
        const data = res.data.result.map((ranking) => {
          arr.push(`\n*Casa:* ${ranking.teamA.name}\n*Fora:* ${ranking.teamB.name}\nCompetição: ${ranking.championship.name}\n *Minuto:* ${ranking.timer}\n Resultado: ${ranking.teamA.score.f} x ${ranking.teamB.score.f}\n`)
        });
        b.sendReply(`*Estas são as partidas de Agora.* ` + arr.join(" "))
      });
    }
      break

    case "aluguel": {
      if (!args.join(""))
        return b.sendReply("Você precisa enviar o link de algum grupo!");
      if (!g.body.includes("whatsapp.com"))
        return b.sendReply("O link precisa ser do whatsapp!");
      console.log(args[2]);

      let pagamento = new payment(TOKEN_MP);

      try {

        let info = await pagamento.create_payment(1);

        b.sendBase64(
          info.qr_code,
          `_Olá ${pushname}_ 👋🏼\n_*Após o pagamento ser efetuado será emitido uma nota de confirmação do pagamento*_📝\n_Com isso, automaticamente você será adicionado como usuário Premium._\n\n_*Copy paste:*_\n${info.copy_paste}\n\n_*Id:*_ ${info.payment_id}`
        );

        // Aguardar a confirmação do pagamento usando a API do Mercado Pago
        let paymentStatus = await waitForPaymentConfirmation(
          pagamento,
          info.payment_id
        );

        if (paymentStatus === "approved") {
          await await bot
            .groupAcceptInvite(args[2])
            .then((res) => {
              b.sendReply(
                `✅ - Pagamento aprovado, entrando no grupo! - ID: ${res}`
              )
              b.sendOwnerMessage(`Venda concluída com sucesso! - ID: ${res}`)

              addPremiumGroup(res, b.sendOwnerMessage);
              return b.sendReply(
                `✅ - Pagamento aprovado, Grupo adicionado ao premium!`
              );
            })
            .catch((err) => {
              b.sendReply(`❌ - Ocorreu um erro ao entrar no grupo...\n\n Mas não se preocupe, basta enviar um print da conversa para meu dono wa.me/${owner} que ele irá resolver o mais rapido possível.`)
              b.sendOwnerError(err)
            })

        } else {
          return b.sendErrorReply(`❌ - O pagamento não foi aprovado.`);
        }
      } catch (error) {
        logger.error(
          "[ ERROR ] - Erro ao criar o pix ou ao executar a ação:\n" + error
        );
        b.sendOwnerError("Pagamento expirado!");
        b.sendErrorReply(error.message);
      }
    }
      break;



    case "addsaldo":
    case "addcash":
      if (g.isGroup) return b.sendReply(response.noGroup);

      let pagamento2 = new payment(TOKEN_MP);
      try {
        let info = await pagamento2.create_payment(0.01);
        b.sendBase64(
          info.qr_code,
          `_Olá ${userName}_ 👋🏼\n_*Após o pagamento ser efetuado será emitido uma nota de confirmação do pagamento*_📝\n_Com isso, automaticamente seu saldo sera adicionado._\n\n_*Copy paste:*_\n${info.copy_paste}\n\n_*Id:*_ ${info.payment_id}`
        );

        // Aguardar a confirmação do pagamento usando a API do Mercado Pago
        let paymentStatus = await waitForPaymentConfirmation(
          pagamento2,
          info.payment_id
        );

        if (paymentStatus === "approved") {
          const yourUser = await Usuario.findOneAndUpdate(
            { numeroTelefone: remoteJid },
            { saldo: userCash + Number(args.join(" ")) }
          );
          yourUser.save();
          b.sendOwnerMessage(
            `Usuario: ${userNumber} atualizou seu saldo para ${userCash + Number(args.join(" "))
            }`
          );
          return b.sendReply(
            `✅ - Pagamento aprovado, saldo atualizado para ${userCash + Number(args.join(" "))
            }`
          );
        } else {
          return b.sendErrorReply(`❌ - O pagamento não foi aprovado.`);
        }
      } catch (error) {
        logger.error(
          "[ ERROR ] - Erro ao criar o pix ou ao executar a ação:\n" + error
        );
        b.sendOwnerError("Pagamento expirado!");
        b.sendErrorReply(error.message);
      }
      break;
    case "toprem":
      if (g.isGroup) return b.sendReply(response.noGroup);
      if (g.premium.some((entry) => entry.user === user))
        return b.sendReply(response.userIsPrem);

      let pagamento = new payment(TOKEN_MP);

      try {
        let info = await pagamento.create_payment(0.01);
        b.sendBase64(
          info.qr_code,
          `_Olá ${pushname}_ 👋🏼\n_*Após o pagamento ser efetuado será emitido uma nota de confirmação do pagamento*_📝\n_Com isso, automaticamente você será adicionado como usuário Premium._\n\n_*Copy paste:*_\n${info.copy_paste}\n\n_*Id:*_ ${info.payment_id}`
        );

        // Aguardar a confirmação do pagamento usando a API do Mercado Pago
        let paymentStatus = await waitForPaymentConfirmation(
          pagamento,
          info.payment_id
        );

        if (paymentStatus === "approved") {
          addPremiumUser(remoteJid, b.sendOwnerMessage);
          return b.sendReply(
            `✅ - Pagamento aprovado, usuário adicionado ao premium!`
          );
        } else {
          return b.sendErrorReply(`❌ - O pagamento não foi aprovado.`);
        }
      } catch (error) {
        logger.error(
          "[ ERROR ] - Erro ao criar o pix ou ao executar a ação:\n" + error
        );
        b.sendOwnerError("Pagamento expirado!");
        b.sendErrorReply(error.message);
      }
      break;
    case "user":
      try {
        if (!user) {
          return b.sendReply(response.noUser);
        }
        m.image(
          userPhoto,
          `_Olá ${userName}_ 👋🏼\n\n
Informações atuais:\n_Nome: *${userName ? userName : "Nao informado"}*_\n_Número: *${userNumber ? userNumber : "Nao informado"
          }*_\n_Premium: *${isUserPrem ? "Sim" : "Nao"}*_\n_Saldo: *${userCash ? userCash : "Nao informado"
          }*_\n\n_Usuários totais: *${Usuario.length
          }*, caso tenha dúvidas consulte nossos termos de uso com o comando */termos*_`
        );
      } catch (error) {
        b.sendOwnerError(error.message);
      }
      break;
    case "rg":
    case "login":
      if (user) {
        return b.sendReply(response.userIs);
      }
      logger.warn("[ USER ] - NewUser: Salvando novo usuario...");
      const newUser = new Usuario({
        nome: pushname,
        numeroTelefone: remoteJid,
        ppuser,
      });
      await newUser.save();
      logger.info(
        `[ USER ] - NewUser: Usuario ${newUser.nome} criado com sucesso`
      );
      m.imageUser(
        newUser.numeroTelefone,
        newUser.ppuser,
        `_Olá ${newUser.nome
        }_ 👋🏼\n_Obrigado por se cadastrar no ${BOT_NAME}\n
Informações atuais:\n_Nome: *${newUser.nome ? newUser.nome : "Nao informado"
        }*_\n_Número: *${newUser.numeroTelefone ? newUser.numeroTelefone : "Nao informado"
        }*_\n_Premium: *${isUserPrem ? "Sim" : "Nao"}*_\n_Saldo: *${newUser.saldo ? newUser.saldo : "Nao informado"
        }*_\n\n_Você foi o usuário de número *${await Usuario.countDocuments()
        }*, caso tenha dúvidas consulte nossos termos de uso com o comando */termos*_`
      );
      b.sendReply(
        "_Ao se cadastrar, *você concordou com todos os termos de uso e condições do Zeus~Bot.* Caso aja dúvidas consulte os termos e condições com o comando */termos*_\n\n_Seu cadastro está sendo efetuado..._\Zeus~Bot"
      );
      b.sendReply("_*Usuario cadastrado com sucesso!*_");
      break;

    case "termos":

      b.sendReply(
        `** Termos de Uso do Bot do WhatsApp **\n\n** 1. Definições **\n* "Bot do WhatsApp" significa um programa de computador que é usado para automatizar a comunicação no WhatsApp.\n* "Usuário" significa qualquer pessoa que use o Bot do WhatsApp.\n* "Proprietário" significa a pessoa ou empresa responsável pelo desenvolvimento e operação do Bot do WhatsApp.\n\n** 2. Aceitação dos Termos de Uso **\n\n        Ao usar o Bot do WhatsApp, o Usuário concorda com os termos e condições aqui estabelecidos.Se o Usuário não concordar com os termos e condições, não poderá usar o Bot do WhatsApp.\n\n** 3. Uso do Bot do WhatsApp **O Usuário é responsável pelo uso do Bot do WhatsApp de forma lícita e aceitável.O Usuário não poderá usar o Bot do WhatsApp para:\n\n* Violar direitos de terceiros, incluindo direitos de propriedade intelectual, direitos de privacidade ou direitos de publicidade;\n* Transmitir conteúdo ilegal, obsceno, difamatório, ameaçador, intimidante, assediante, odioso, ofensivo em termos raciais ou étnicos, ou que instigue ou encoraje condutas que sejam ilícitas ou inadequadas;\n* Transmitir declarações falsas, incorretas ou enganosas;\n* Se passar por outra pessoa;\n* Enviar comunicações ilícitas ou não permitidas, como mensagens em massa, mensagens automáticas, ligações automáticas e afins;\n* Usar o Bot do WhatsApp para fins não pessoais, a menos que esteja autorizado pelo Proprietário.\n\n** 4. Direitos de Propriedade Intelectual **\n\n O Bot do WhatsApp é propriedade intelectual do Proprietário.O Usuário não poderá copiar, modificar, distribuir ou utilizar o Bot do WhatsApp de qualquer forma que não seja expressamente autorizada pelo Proprietário.\n\n** 5. Limitação de Responsabilidade **\n\n O Proprietário não será responsável por quaisquer danos, diretos ou indiretos, que sejam causados ao Usuário ou a terceiros em decorrência do uso do Bot do WhatsApp.\n\n** 6. Modificação dos Termos de Uso **\n\nO Proprietário poderá modificar os Termos de Uso a qualquer momento.As modificações entrarão em vigor a partir da data de sua publicação no site do Proprietário.\n\n** 7. Lei Aplicável **\n\nOs Termos de Uso serão regidos e interpretados de acordo com as leis da República Federativa do Brasil.\n\n** 8. Foro **\n\nQuaisquer controvérsias decorrentes dos Termos de Uso serão dirimidas no Foro da Comarca de Porto Alegre, Estado do Rio Grande do Sul.**\n\n 9. Disposições Gerais **\n\n Se qualquer disposição dos Termos de Uso for considerada inválida ou ineficaz, as demais disposições permanecerão em pleno vigor e efeito.\n** FIM **`
      )
      break
    case "gpt":
    case "bard":
    case "llama":
    case "bing":
    case "mixtral":
      addFilter(remoteJid);
      if (!args.join(" ")) return b.sendReply("O que vc deseja perguntar?");
      axios
        .get(`${BASEURL}ia/${command}/?msg=${args.join("")}. Idioma: portugues`)
        .then((res) => {
          b.sendReply(res.data);
        });
      break;
    case "gemini":
      addFilter(remoteJid);
      if (!args.join(" ")) return b.sendReply("O que vc deseja perguntar?");
      axios
        .get(`${BASEURL}ia/${command}/?msg=${args.join("")}`)
        .then((res) => {
          b.sendReply(res.data);
        });
      break;

    case "historia":
      if (!args.join(" ")) return b.sendReply("Qual o tema ou o contexto da historia que vc deseja?");

      axios
        .get(`${BASEURL}ia/${command}/?msg=${args.join("")}`)
        .then((res) => {
          b.sendReply(res.data);
        });
      break;
    case "resumir":
      if (!args.join(" ")) return b.sendReply("Qual o texto que você deseja resumir?");

      axios
        .get(`${BASEURL}ia/${command}/?msg=${args.join("")}`)
        .then((res) => {
          b.sendReply(res.data);
        });
      break;

    case "absolutereality":
    case "amireal":
    case "analogdiffusion":
    case "anything":
    case "orangemix":
    case "childrensstories":
    case "semireal":
    case "toonanime":
    case "cuteyukimi":
    case "cyberrealistic":
    case "deliberate":
    case "dreamlikeanime":
    case "dreamlikephotoreal":
    case "eimisanimediffusion":
    case "lofi":
    case "openjourney":
    case "realisticvision":
    case "redsshift":
    case "toonyou":
    case "revanimated": {
      if (!args.join(" ")) return b.sendReply("O que você deseja criar?");
      b.sendWaitReply()
      const response = await axios.get(
        `${BASEURL}work/tradutor/?text=${encodeURIComponent(
          args.join(" ")
        )}&idioma=en`
      )
      const english = response.data.texto;
      m.image(`${BASEURL}ia/imagegenerator/revanimated/?text=${english}`, "Aqui está o resultado...")
    }
      break
    case "ip":
      if (!args.join(""))
        return b.sendReply("Qual ip vc deseja saber? EX: 66.87.125.72");
      axios.get(`${BASEURL}/work/ip/?ip=${args.join("")}`).then((res) => {
        try {
          let ipAddressInfo = res.data;
          m.sendText(`
    Endereço IP: ${ipAddressInfo.ip}
    Nome do host: ${ipAddressInfo.hostname}
    Cidade: ${ipAddressInfo.city}
    Região: ${ipAddressInfo.region}
    País: ${ipAddressInfo.country}
    Localização: ${ipAddressInfo.loc}
    CEP: ${ipAddressInfo.postal}
    Fuso horário: ${ipAddressInfo.timezone}
    Provedor de serviços de Internet (ISP): ${ipAddressInfo.company.name}
    Operadora de celular: ${ipAddressInfo.carrier.name}
    Tipo de ISP: ${ipAddressInfo.company.type}
    VPN: ${ipAddressInfo.privacy.vpn}
    Proxy: ${ipAddressInfo.privacy.proxy}
    Tor: ${ipAddressInfo.privacy.tor}
    Relay: ${ipAddressInfo.privacy.relay}
    Hosting: ${ipAddressInfo.privacy.hosting}
    Serviço: ${ipAddressInfo.privacy.service}
    Endereço de abuso: ${ipAddressInfo.abuse.address}
    País de abuso: ${ipAddressInfo.abuse.country}
    Endereço de e-mail de abuso: ${ipAddressInfo.abuse.email}
    Nome de abuso: ${ipAddressInfo.abuse.name}
    Rede de abuso: ${ipAddressInfo.abuse.network}
    Telefone de abuso: ${ipAddressInfo.abuse.phone}
  `);
        } catch (error) {
          b.sendText(error);
        }
      });
      break;

    case "tts2":
      if (!args.join("")) return b.sendText(response.noText);
      m.audio(
        `https://api.voicerss.org/?key=71b47c514dd74863b9a5bca42c297f58&hl=pt-BR&v=dinis&src=${text}`
      );
      break;

    case "pet":
      {
        if (!isImage) return b.sendReply(response.noImg);

        const input = await downloadImage(msg, "input");
        const imagetoLink = await upload(input);

        b.sendWaitReply()

        const inputPath = path.resolve(TEMP_DIR, "output.gif");
        const outputPath = path.resolve(TEMP_DIR, "output.webp");
        var link = `https://api.popcat.xyz/pet?image=${imagetoLink}`

        await downloadWithAxios(link, inputPath);

        exec(
          `ffmpeg -i ${inputPath} -y -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512,fps=12,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -f webp ${outputPath}`,
          async () => {

            await m.sendStickerFromFile(outputPath);
            fs.unlinkSync(input);
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
          }
        );

      }
      break;
    case "drip":
      if (!isImage) return b.sendReply(response.noImg);
      b.sendWaitReply();
      const inputPath = await downloadImage(msg, "input");
      const imagetoLink = await upload(inputPath);
      m.image(`https://api.popcat.xyz/drip?image=${imagetoLink}`);
      break;
    case "carro":
      axios.get(`https://api.popcat.xyz/car`).then((res) => {
        const image = res.data.image;
        m.image(image, res.data.title);
      });
      break;
    case "colorir":
      {
        if (!isImage) return b.sendReply(response.noImg);
        b.sendWaitReply();
        const inputPath = await downloadImage(msg, "input");
        const imagetoLink = await upload(inputPath);
        m.image(`${vihaURL}tools/colorize?url=${imagetoLink}`);
      }
      break;
    case "tohd":
      {
        if (!isImage) return b.sendReply(response.noImg);
        b.sendWaitReply();
        const inputPath = await downloadImage(msg, "input");
        const imagetoLink = await upload(inputPath);
        m.image(`${vihaURL}tools/enhance?url=${imagetoLink}`);
      }
      break;

    case "fakedados":
      {
        const response = await axios.get(`${vihaURL}tools/fakeinfo`);
        // Adapt the response
        var dds = response.data.data.results.map(
          (user) =>
            `🆔 *Id:* ${user.id.value}\n 🧬 *Nome:* ${user.name.first} ${user.name.last
            }\n *✉️ Email:* ${user.email}\n 📞 *Telefone:* ${user.phone
            }\n 📱 *Celular:* ${user.cell}\n 🏙️ *Endreço:* ${user.location.street +
            " " +
            user.location.city +
            " " +
            user.location.state
            }\n 🗺️ *CEP:* ${user.location.postcode}\n 🚩 *Coordenadas:* ${user.location.coordinates.latitude +
            " " +
            user.location.coordinates.longitude
            }\n 📅 *Nascimento:* ${user.dob.date}\n 🪪 *Idade:* ${user.dob.age
            }\n 🧔 *Gênero:* ${user.gender}\n 🌍 *Nacionalidade:* ${user.nat
            }\n 🤳 *Foto*: ${user.picture.medium}`
        );

        // Send the response
        await b.sendText(dds);
      }
      break;
    case "bin":
      {
        const response = await axios.get(
          `${vihaURL}tools/bingen/?query=${args.join("")}`
        );
        if (!args.join(""))
          return b.sendText(
            `*Por favor informe um bin!* \n\n *Exemplo:* \n\n *${PREFIX}bin 44270700*`
          );
        // Adapt the response

        // Adapt the response
        let res =
          `*Cartões gerados com sucesso!* ✔️: \n\n 🎲 *Dados:*` +
          response.data.data.map((user) => {
            let cvv = user.CardNumber;
            let date = user.ExpirationDate;
            let number = user.CVV;
            return ` \n *Número:* ${number} \n *Data de expiração:* ${date} \n *CVV:* ${cvv}`;
          });
        // Send the respons
        await b.sendText(res);
      }
      break;
    case "fortniteshop":
      b.sendWaitReply();
      m.image(`${BASEURL}/cards/fortniteshop`);
      break;

    case "totext":
      if (!isAudio) {
        return b.sendReply(`Voce precisa marcar um audio para continuar...`);
      }
      b.sendWaitReply();
      const textAudio = await audioTotext(msg, "pt");

      const textConvert = textAudio.text;

      b.sendReply(
        `_Opa ${pushname}_ 👋🏼
\n_Seu áudio de *${textAudio.audio_duration
        } segundos* foi convertido em texto com sucesso!_\n\n_*Conteúdo:*_ _${textConvert}_\n\n_*Informações extras:${"\u200B".repeat(
          4000
        )}*_\n_Este texto teve um *total de ${textAudio.words.length
        } palavras*, ele foi convertido para *${textAudio.language_code
        }*. Felizmente nao houve Complicações para converter seu audio em texto, caso tenha ocorrido algum problema entre em contato usando *${PREFIX}suporte*_ 🤖
`
      );

      break;

    case "toaudio":
      if (!isVideo) {
        return b.sendReply(`Voce precisa marcar um video para continuar...`);
      }
      b.sendWaitReply();
      logger.warn("[ ToAudio ] D: Efetuando download do video...");
      const pathToVideo = await downloadVideo(msg, "video.mp4");
      m.audio(pathToVideo);
      logger.warn(
        "[ ToAudio ] Dc: Video baixado e convertido em audio com êxito!"
      );
      b.sendReply(
        `_Opa ${pushname}_ 👋🏼\n_Seu video foi *convertido em audio com sucesso!*_`
      );
      break;
    case "get":
      try {
        if (!isCreator) return b.sendReply(response.isCreator);

        const folderPath = "./assets/conect";
        const zipPath = "./assets/conect/conexao.zip";

        await createZipFolder(folderPath, zipPath);
        m.document(zipPath, "application/zip");
      } catch (error) {
        logger.error(
          "[ ERROR ] - Erro ao criar o arquivo zip ou ao executar a ação:\n" +
          error
        );
        b.sendOwnerError(error.message);
      }
      break;

    case "ping":
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      await b.sendReply(
        `🏓 Pong!\n⌚ Tempo de resposta: ${responseTime}ms\n🕐 Tempo online: ${uptimeFormatted}`
      );
      break;
    //////////////////comandos de administradres////////////////////////

    case "desc":
    case "descrição":
    case "setdesc":
      try {
        if (!isGroup) {
          return b.sendReply(response.isGroup);
        }

        const description = args.join(" ").trim();

        if (!description) {
          return b.sendReply(
            "Insira a descrição que você deseja definir para o grupo!"
          );
        }
        if (!isAdmins) {
          return b.sendErrorReply(response.isAdmins);
        }
        if (!isBotAdmins) {
          return b.sendErrorReply(response.isBotAdmins);
        }

        g.groupDesc(description);
        b.sendReply("Descrição atualizada com sucesso!");
        logger.info("[ WhatsApp ] - ADM: Descrição atualizada com sucesso!");
      } catch (error) {
        logger.error(
          `[ ERROR ] - Ocorreu um erro no comando 'desc':\n${error}`
        );
        b.sendOwnerError(`Ocorreu um erro: ${error.message}`);
        b.sendReply("Houve um erro ao executar o comando.");
      }
      break;
    case "exit":
      try {
        if (!isGroup) {
          return b.sendReply(response.isGroup);
        }

        if (!isAdmins) {
          return b.sendReply(response.isAdmins);
        }
        await b.sendSuccessReply("Ok, chefe.");
        await g.exit();
        logger.info("BOT: ADM: Bot desvinculado com exito!");
      } catch (error) {
        b.sendOwnerError(`Ocorreu um erro ao sair do grupo: ${error.message}`);
        logger.error(`[ BOT ] - Erro ao sair do grupo: ${error}`);
      }
      break;

    case "open":
    case "close":
      if (!isGroup) return b.sendReply(response.isGroup);
      if (!isAdmins) return b.sendReply(response.isAdmins);
      if (!isBotAdmins) return b.sendReply(response.isBotAdmins);

      try {
        logger.info(
          " [WhatsApp ] - ADM: Configuração do grupo atualizada com exito!"
        );

        const success =
          command == "open"
            ? g.groupSettings("not_announcement")
            : g.groupSettings("announcement");

        if (success) {
          b.sendReply(
            `Grupo ${command == "open" ? "aberto" : "fechado"} com sucesso!`
          );
        } else {
          b.sendReply(
            `Não foi possível ${command == "open" ? "abrir" : "fechar"
            } o grupo.`
          );
        }
      } catch (error) {
        logger.error(
          `[ ERROR ] - Ocorreu um erro no comando '${command}':\n${error}`
        );
        b.sendOwnerError(`Ocorreu um erro: ${error.message}`);
        b.sendReply("Houve um erro ao executar o comando.");
      }
      break;

    case "hidetag":
      if (!isGroup) return b.sendReply(response.isGroup);
      if (!isAdmins) return b.sendReply(response.isAdmins);

      try {
        var q = g.body.slice(9);
        q = q ? q : "";
        var participantes = participants.map((a) => a.id);
        b.sendTextWithMention(q, [participantes]);
        logger.info("[WhatsApp] - ADM: Hidetag executado com êxito!");
      } catch (err) {
        logger.error(
          `[ ERROR ] - Ocorreu um erro no comando 'hidetag':\n${err}`
        );
        b.sendOwnerError(`Ocorreu um erro: ${err.message}`);
        b.sendReply("Houve um erro ao executar o comando.");
      }
      break;

    case "kick":
      if (!isGroup) return b.sendReply(response.isGroup);
      if (!isAdmins) return b.sendReply(response.isAdmins);
      if (!isBotAdmins) return b.sendErrorReply(response.isBotAdmins);
      if (g.isMentionRequired) {
        return b.sendReply(
          `Você precisa marcar alguém para usar este comando! \n Ex: ${PREFIX + command
          } @membro`
        );
      }

      try {
        const success = g.groupActions(g.userMentioned, "remove");
        if (success) {
          b.sendTextWithMention(
            `O usuário @${g.userMentioned.split("@")[0]
            } foi eliminado com sucesso!`,
            [g.userMentioned]
          );
          logger.info("[ WhatsApp ] - ADM: Usuario removido com êxito!");
        } else {
          b.sendReply("Não foi possível eliminar o usuário.");
        }
      } catch (err) {
        logger.error(`[ ERROR ] - Ocorreu um erro no comando 'kick':\n${err}`);
        b.sendOwnerError(`Ocorreu um erro: ${err.message}`);
        b.sendReply("Houve um erro ao executar o comando.");
      }
      break;

    case "marcartodos":
    case "tagall":
    case "totag":
      if (!isGroup) return b.sendReply(response.isGroup);
      if (!isAdmins && !isCreator) return b.sendReply(response.isAdmins);

      try {
        q = args.join(" ");
        let teks = `══✪〘 *MARCANDO* 〙✪══
  
       ➲ *Motivo : ${q ? q : "em branco"}*\n\n`;
        for (let mem of participants) {
          teks += `⭔ @${mem.id.split("@")[0]}\n`;
        }
        bot.sendMessage(
          remoteJid,
          { text: teks, mentions: participants.map((a) => a.id) },
          { quoted: msg }
        );
        logger.info("[WhatsApp] - ADM: Membros marcados com êxito!");
      } catch (err) {
        logger.error(
          `[ ERROR ] - Ocorreu um erro no comando 'marcartodos':\n${err}`
        );
        b.sendOwnerError(`Ocorreu um erro: ${err.message}`);
        b.sendReply("Houve um erro ao executar o comando.");
      }
      break;

    case "name":
    case "nome":
    case "setname":
      if (!isGroup) return b.sendReply(response.isGroup);

      if (!args.join("")) {
        return b.sendReply(
          "Insira o nome que você deseja definir para o grupo!"
        );
      }

      if (!isAdmins) return b.sendReply(response.isAdmins);
      if (!isBotAdmins) return b.sendErrorReply(response.isBotAdmins);

      try {
        bot.groupUpdateSubject(remoteJid, args.join(" "));
        b.sendReply("Nome do grupo atualizado com sucesso!");
        logger.info("[ WhatsApp ] - ADM: Nome do grupo atualizado com êxito!");
      } catch (err) {
        logger.error(`[ ERROR ] - Ocorreu um erro no comando 'name':\n${err}`);
        b.sendOwnerError(`Ocorreu um erro: ${err.message}`);
        b.sendReply("Houve um erro ao executar o comando.");
      }
      break;

    case "welcomecard":
    case "welcomeimg":
    case "welcometext":
    case "welcome":
      try {
        if (!isGroup) return b.sendReply(response.isGroup);
        if (!isAdmins) return b.sendReply(response.isAdmins);
        if (!g.body.includes("on") && !g.body.includes("off"))
          return b.sendReply(response.noAntiArgs);

        let w = {
          id: remoteJid,
          mode:
            command === "welcomecard"
              ? "card" || command === "welcome"
              : command === "welcomeimg"
                ? "image"
                : "text",
        };

        if (args.join(" ") === "on") {
          if (g.isWelcome)
            return b.sendReply(
              `Olá ${pushname}, parece que algum welcome já estava ativo, verifique e tente novamente para ativar o ${command}!`
            );
          g.welcome.push(w);
          fs.writeFileSync(
            "./assets/database/welcome.json",
            JSON.stringify(g.welcome)
          );
          logger.info(
            `[ WhatsApp ] - ADM: Modo welcome (${w.mode}) ativado com êxito!`
          );
          b.sendReply(`O ${command} foi ativado com sucesso 😎`);
        } else if (args.join(" ") === "off") {
          if (!g.isWelcome) return b.sendReply("Já está desativado");
          const index = g.welcome.findIndex((item) => item.id === w.id);
          if (index !== -1) {
            g.welcome.splice(index, 1);
            fs.writeFileSync(
              "./assets/database/welcome.json",
              JSON.stringify(g.welcome)
            );
            logger.info(
              `[ WhatsApp ] - ADM: Modo welcome (${w.mode}) desativado com êxito!`
            );
            b.sendReply(`O ${command} foi desativado 🤝`);
          }
        }
      } catch (error) {
        logger.error(
          `[ ERROR ] - Ocorreu um erro no comando '${command}':\n${error}`
        );
        b.sendOwnerError(error.message);
        b.sendReply(`Ocorreu um erro: ${error}`);
      }
      break;

    case "promote":
    case "demote":
      if (!isGroup) return b.sendReply(response.isGroup);
      if (g.isMentionRequired)
        return b.sendReply(
          `Você precisa marcar alguém para usar este comando! \n Ex: ${PREFIX + command
          } @membro`
        );
      if (!isAdmins) return b.sendReply(response.isAdmins);
      if (!isBotAdmins) return b.sendErrorReply(response.isBotAdmins);

      try {
        const action =
          command === "promote"
            ? "promote"
            : command === "demote"
              ? "demote"
              : "";
        if (action) {
          const success = g.groupActions(g.userMentioned, action);
          if (success) {
            const actionText = action === "promote" ? "promovido" : "rebaixado";
            b.sendTextWithMention(
              `O usuário @${g.userMentioned.split("@")[0]
              } foi ${actionText} com sucesso!`,
              [g.userMentioned]
            );
            logger.info(`[ WhatsApp ]: ADM: Membro ${actionText} com g.exito!`);
          } else {
            b.sendReply(`Não foi possível ${action} o usuário.`);
          }
        }
      } catch (err) {
        logger.error(
          `[ ERROR ] - Ocorreu um erro no comando '${command}':\n${err}`
        );
        b.sendOwnerError(err.message);
        b.sendReply(`Ocorreu um erro: ${err}`);
      }
      break;
    case "deletar":
      if (!msg.quoted.fakeObj.key) return b.sendReply(response.noMark);
      {
        b.deleteMessage(msg.quoted.fakeObj.key);
      }
      break;
    //////////////////ATIVACAO////////////////////////////

    case "autosticker":
    case "autotext":
    case "modoadm":
    case "antifake":
    case "nsfw":
    case "modosimi":
      if (!g.body.includes("on") && !g.body.includes("off"))
        return b.sendReply(response.noAntiArgs);
      if (!isAdmins) return b.sendReply(response.isAdmins);
      if (!isBotAdmins) return b.sendErrorReply(response.isBotAdmins);
      try {
        onReadyJson(bot, msg, command, remoteJid, groupName);
      } catch (error) {
        b.sendOwnerError(error.message);
        logger.warn("[ ERROR ] - ACTIVATE" + error);
      }

      break;
    case "antilink":
    case "antilinkhard":
      try {
        if (!isGroup) return b.sendReply(response.isGroup);
        if (!isAdmins) return b.sendReply(response.isAdmins);
        if (!g.body.includes("on") && !g.body.includes("off"))
          return b.sendReply(response.noAntiArgs);

        let w = {
          id: remoteJid,
          mode: command == "antilink" ? "link" : "linkhard",
        };

        if (args.join(" ") === "on") {
          if (g.isAntiLink)
            return b.sendReply(
              `Olá ${pushname}, parece que algum antilink já estava ativo, verifique e tente novamente para ativar o ${command}!`
            );
          g.antilink.push(w);
          fs.writeFileSync(
            "./assets/database/antilink.json",
            JSON.stringify(g.antilink)
          );
          logger.info(
            `[ WhatsApp ] - ADM: Modo Antilink (${w.mode}) ativado com êxito!`
          );
          b.sendReply(`O ${command} foi ativado com sucesso 😎`);
        } else if (args.join(" ") === "off") {
          if (!g.isAntiLink) return b.sendReply("Já está desativado");
          const index = g.antilink.findIndex((item) => item.id === w.id);
          if (index !== -1) {
            g.antilink.splice(index, 1);
            fs.writeFileSync(
              "./assets/database/antilink.json",
              JSON.stringify(g.antilink)
            );
            logger.info(
              `[ WhatsApp ] - ADM: Modo welcome (${w.mode}) desativado com êxito!`
            );
            b.sendReply(`O ${command} foi desativado 🤝`);
          }
        }
      } catch (error) {
        logger.error(
          `[ ERROR ] - Ocorreu um erro no comando '${command}':\n${error}`
        );
        b.sendOwnerError(error.message);
        b.sendReply(error.message);
      }
      break;
    ////////////////////////////////FIM////////////////////////

    ////////////////AUDIO EFECTS////////////////////////
    case "equalizer": // Ajusta as g.bandas de frequência para criar um equalizador gráfico personalizado.
    case "volume": // Ajusta o nível de volume do áudio.
    case "acrusher": // Aplica uma distorção estilo "bitcrusher" ao áudio.
    case "slow": // Altera a velocidade do áudio sem afetar o tom.
    case "asetrate": // Define a taxa de amostragem do áudio.
    case "areverse": // Inverte o áudio, tocando-o de trás para frente.
    case "afftfilt": // Aplica filtragem de frequência usando a Transformada Rápida de Fourier (FFT).
    case "chorus": // Adiciona um efeito de coro ao áudio.
    case "bass": // Realça as frequências de graves no áudio.
    case "bandreject": // Aplica um filtro de rejeição de g.banda ao áudio.
    case "robot": // Amplifica as frequências de alta-passagem e atenua as frequências de baixa-passagem, criando um efeito de voz robótica.
    case "fast":
      if (!isAudio) return b.sendReply(response.isAudio);
      const audioEffectMap = {
        equalizer: "-af equalizer=f=54:width_type=o:width=2:g=20",
        volume: "-af volume=12",
        acrusher: "-af acrusher=.1:1:64:0:log",
        slow: "-af atempo=4/4,asetrate=44500*2/3",
        asetrate: "-af asetrate=44100",
        areverse: "-filter_complex areverse",
        afftfilt:
          "-filter_complex \"afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75\"",
        anequalizer: "-af anequalizer=f=1000:g=5",
        chorus: "-af chorus=0.7:0.9:55:0.4:0.25:2",
        bass: "-af equalizer=f=100:width_type=q:width=2:g=10",
        bandreject: "-af bandreject=f=1000:w=300",
        comp: "-af compand=0.3|0.3:1|1:-90/-90|-70/-70|-30/-30:0:0:0",
        robot:
          "-af afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75",
        fast: '-filter:a "atempo=1.5"',
        tupai: "-filter:a 'atempo=0.5,asetrate=65100'",
      };
      const effectOption = audioEffectMap[command];
      b.sendWaitReply();

      try {
        const inputPath = await downloadAudio(msg, "input");
        const outputPath = path.resolve(TEMP_DIR, "output.mp3");

        exec(
          `ffmpeg -i ${inputPath} -y ${effectOption} ${outputPath}`,
          async (err) => {
            if (err) {
              console.error(err);
              b.sendErrorReply("Ocorreu um erro ao processar o áudio.");
            } else {
              m.audio(outputPath);
            }
          }
        );
      } catch (err) {
        logger.error(
          `[ ERROR ] - Ocorreu um erro no comando '${command}':\n${error}`
        );
        b.sendOwnerError(error.message);
        b.sendReply("Ocorreu um erro ao processar o áudio.");
      }
      break;
    ////////////////////////////////FIM////////////////////////

    ///////////////////////////CANVAS///////////////////////////

    case "gayf":
    case "blur":
    case "invert":
    case "sepia":
    case "ad":
    case "affect":
    case "beautiful":
    case "bobross":
    case "confusedstonk":
    case "discordblack":
    case "delete":
    case "discordblue":
    case "facepalm":
    case "hitler":
    case "jail":
    case "karaba":
    case "mms":
    case "notstonk":
    case "poutine":
    case "rip":
    case "stonk":
    case "tatoo":
    case "thomas":
    case "trash":
    case "circle":
    case "triggered":
      if (!isImage) return b.sendReply(response.noImg);
      b.sendWaitReply()
      try {
        if (command == "gayf") {
          const inputPath = await downloadImage(msg, "input");
          const imagetoLink = await upload(inputPath);

          // Efeito de blur aplicado
          const blurredImageLink = `${BASEURL}canvas/efects/gay/?img=${imagetoLink}`;

          m.image(
            blurredImageLink,
            `🖼️ _Aqui está sua imagem com efeito *${command}*, ${pushname}!_`
          );
        } else {
          const inputPath = await downloadImage(msg, "input");
          const imagetoLink = await upload(inputPath);

          // Efeito de blur aplicado
          const blurredImageLink = `${BASEURL}canvas/efects/${command}/?img=${imagetoLink}`;

          m.image(
            blurredImageLink,
            `🖼️ _Aqui está sua imagem com efeito *${command}*, ${pushname}!_`
          );
        }
      } catch (err) {
        logger.error(
          `[ ERROR ] - Ocorreu um erro no comando '${command}':\n${error}`
        );
        b.sendOwnerError(error.message);
        b.sendReply(`Ocorreu um erro: ${error}`);
      }
      break;

    case "ban":
      if (!isCreator) return b.sendReply(response.isCreator);
      if (g.isMentionRequired) return b.sendReply(response.g.isMentionRequired);
      try {
        if (g.isBan) return b.sendReply(`Esse usuário já estava banido! 🤦`);
        g.ban.push(g.userMentioned);
        fs.writeFileSync("./assets/database/ban.json", JSON.stringify(g.ban));
        b.sendTextWithMention(
          `O @${g.userMentioned.split("@")[0]} foi banido com sucesso 😎`,
          [g.userMentioned]
        );
        logger.info("[ BOT ] - OWNER: Usuario banido com êxito!");
      } catch (error) {
        b.sendOwnerError(error.message);
        b.sendReply(error);
      }
      break;
    case "unban":
      if (!isCreator) return b.sendReply(response.isCreator);
      if (g.isMentionRequired) return b.sendReply(response.isMentionRequired);
      if (!g.isBan) return b.sendReply(`Esse usuário não estava banido! 🤦`);

      try {
        // Suponha que você queira remover o usuário com o nome de usuário "usuario_a_ser_removido"
        g.ban.splice(g.ban.indexOf(g.userMentioned));
        fs.writeFileSync("./assets/database/ban.json", JSON.stringify(g.ban));
        b.sendTextWithMention(
          `O @${g.userMentioned.split("@")[0]} foi desbanido com sucesso!`,
          [g.userMentioned]
        );

        b.sendTextWithMention(
          `O @${g.userMentioned.split("@")[0]} foi desbanido com sucesso 😎`,
          [g.userMentioned]
        );
        logger.info("[ BOT ] - Owner: Usuario desbanido com êxito!");
      } catch (error) {
        b.sendOwnerError(error.message);
        b.sendReply(error.message);
      }
      break;
    case "bangp":
      if (!isCreator)
        return b.sendReply(
          `Somente meu criador pode fazer o uso deste comando!`
        );
      try {
        if (g.isBangp) return b.sendReply(`Esse usuário já estava banido! 🤦`);
        g.bangp.push(remoteJid);
        fs.writeFileSync(
          "./assets/database/bangp.json",
          JSON.stringify(g.bangp)
        );
        b.sendReply(`O Grupo foi banido com sucesso 😎`);
        logger.info("[ BOT ] - OWNER: Grupo banido com exito!");
      } catch (error) {
        b.sendOwnerError(error.message);
        b.sendReply(error);
      }
      break;
    case "block":
    case "unblock":
      if (!isCreator) return b.sendReply(response.isCreator);
      if (g.isMentionRequired) {
        return b.sendReply(
          `Você precisa marcar alguém para usar este comando! \n Ex: ${PREFIX + command
          } @membro`
        );
      }
      await g.blockAndunBlockUser(g.userMentioned, command);
      logger.info(`[ BOT ] - Owner: o usuario foi ${command} com êxito!`);
      await b.sendReply(
        `O usuário @${g.userMentioned.split("@")[0]} levou ${command}`,
        g.userMentioned
      );
      break;
    case "addprem":
    case "addpremium":
      if (!isCreator) return b.sendReply(response.isCreator);
      if (!g.userMentioned)
        return b.sendReply("marque a pessoa que deve receber o premium!");
      addPremiumUser(remoteJid, b.sendOwnerMessage);
      break;
    case "delprem":
      if (!isCreator) return b.sendReply(response.isCreator);
      if (g.isMentionRequired) return b.sendReply(response.isMentionRequired);
      if (!g.isPremium) return b.sendReply("este usuario não era premium!");
      try {
        // Suponha que você queira remover o usuário com o nome de usuário "usuario_a_ser_removido"
        const usernameToRemove = g.userMentioned;

        // Encontra o índice do usuário no array (se existir)
        const userIndex = g.premiumData.indexOf(usernameToRemove);

        if (userIndex !== -1) {
          // Remove o usuário do array
          g.premiumData.splice(userIndex, 1);

          // Escreve o array de volta no arquivo JSON
          fs.writeFileSync(g.premiumFile, JSON.stringify(g.premiumData));
          logger.info(
            "[ BOT ] - Owner: Usuario retirado ao premium com êxito!"
          );
          b.sendTextWithMention(
            `O @${usernameToRemove.split("@")[0]
            } foi rebaixado a membro comum com sucesso 😎`,
            [usernameToRemove]
          );
        } else {
          b.sendReply("Olá dono, você mencionou um usuário corretamente?");
        }
      } catch (error) {
        b.sendOwnerError(error.message);
        b.sendReply(error.message);
      }
      break;
    case "join":
      if (!isCreator) return b.sendReply(response.isCreator);
      if (!args.join(""))
        return b.sendReply("Você precisa enviar o link de algum grupo!");
      if (!g.body.includes("whatsapp.com"))
        return b.sendReply("O link precisa ser do whatsapp!");
      await g.join(args[2]);
      logger.warn("[ BOT ] - Owner: Bot adiciconado com êxito!");

      break;
    case "unbangp":
      try {
        if (!g.isBangp) return b.sendReply(`Esse grupo não estava banido! 🤦`);

        if (!isAdmins || !isCreator)
          return b.sendReply(
            `Você não tem permissão para fazer o uso deste comando!`
          );

        // Suponha que você queira remover o usuário com o nome de usuário "usuario_a_ser_removido"
        const usernameToRemove = remoteJid;

        // Encontra o índice do usuário no array (se existir)
        const userIndex = g.banData.indexOf(usernameToRemove);

        if (userIndex !== -1) {
          // Remove o usuário do array
          g.banData.splice(userIndex, 1);

          // Escreve o array de volta no arquivo JSON
          fs.writeFileSync(g.banFile, JSON.stringify(g.banData));

          b.sendReply(`O grupo foi desbanido com sucesso 😎`);
          logger.warn("[ BOT ] - Owner: Grupo desbanid com êxito!");
        }
      } catch (error) {
        b.sendOwnerError(error.message);
        b.sendReply(error);
      }

      break;
    ///////////////////////////////FIM////////////////////

    ////////////////DOWNLOAD////////////////
    ////COLOCAR IGDL

    case "play":
      if (!g.body.slice(6)) {
        return b.sendReply(
          `Você precisa enviar um termo de busca!\nExemplo: ${PREFIX}play kamaitachi`
        );
      }
      b.sendWaitReply2();
      yts(args.join(" ")).then(async (getData) => {
        let result = getData.videos.slice(0, 1);
        const videoData = getData.videos[0];
        const videoID = videoData.videoId;
        const url = videoData.url;
        const title = videoData.title;
        const description = videoData.description;
        const thumbnail = videoData.thumbnail;
        const duration = videoData.duration;
        const ago = videoData.ago;
        const timestamp = videoData.timestamp;
        const views = videoData.views;
        const author = videoData.author;
        var msgs = `🎵 *Título:* ${title}\n 🔗*URL:*${url}\n 📺 *Autor:* ${author.name}\n👁️ *Visualizações:* ${views}\n⏱️ *Duração:* ${duration}\n🕒 *Tempo decorrido:* ${ago}\n⏲️ *Tempo total:* ${timestamp}\n✍️ *Descrição:* ${description}`;
        m.image(thumbnail, msgs); 
        m.audio(`${BASEURL}download/yt/ytmp3/?link=${url}`, true);
      });
      break;


    case "playmp4":
      if (!g.body.slice(9)) {
        return b.sendReply(
          `Você precisa enviar um termo de busca!\nExemplo: ${PREFIX}play kamaitachi`
        );
      }
      b.sendWaitReply();
      yts(args.join(" ")).then(async (getData) => {
        const videoData = getData.videos[0];
        const url = videoData.url;
        const title = videoData.title;
        const description = videoData.description;
        const thumbnail = videoData.thumbnail;
        const duration = videoData.duration;
        const ago = videoData.ago;
        const timestamp = videoData.timestamp;
        const views = videoData.views;
        const author = videoData.author;
        // const YTDL = require("../functions/yt");
        var msgs = `🎵 *Título:* ${title}\n 🔗*URL:*${url}\n 📺 *Autor:* ${author.name}\n👁️ *Visualizações:* ${views}\n⏱️ *Duração:* ${duration}\n🕒 *Tempo decorrido:* ${ago}\n⏲️ *Tempo total:* ${timestamp}\n✍️ *Descrição:* ${description}`;
        m.image(thumbnail, msgs);
        m.video(`${BASEURL}download/yt/ytmp4/?link=${url}`);
      });
      break;
    case "spotify":
    case "spotifydl":
      if (!g.body.includes("open.spotify.com")) {
        return b.sendReply(
          `Você precisa enviar um link válido do spotify!\nExemplo: ${PREFIX}spotifydl https://open.spotify.com/intl-pt/track/54u86CmMqGI1rRuULlTqaB?si=8b6e36292d7f4e6b`
        );
      }
      axios
        .get(`${BASEURL}download/spotify/?link=${g.body.slice(11)}`)
        .then(async (response) => {
          m.image(
            response.data.infos[0].cover_url,
            `✍️ *Título:* ${response.data.infos[0].name}\n 💿 *Álbum:* ${response.data.infos[0].album_name}\n 📅 *Lançamento:* ${response.data.infos[0].release_date}`
          );
          await b.sendDlAudio(
            response.data.dllink,
            response.data.infos[0].name,
            response.data.infos[0].cover_url
          );
        });
      break;
    case "instagram":

      if (!g.body.includes("instagram.com")) {
        return b.sendReply(
          `Você precisa enviar um link válido do insta!\nExemplo: ${PREFIX + command} https://www.instagram.com/reel/C0OWOclBE6X/?utm_source=ig_web_copy_link`
        );
      }

      try {
        logger.info("[ IGLD ] - D: Baixando do Insta...");

        const response = await axios.get(
          `${BASEURL}download/instagram/?link=${g.body.slice(11)}`
        );

        b.sendWaitReply()
        m.video(response.data[0].url)
        logger.warn("[ IGDL ] - Dc: Video enviado com êxito!");
      } catch (error) {
        b.sendOwnerError(error.message);
        b.sendReply(
          `Ocorreu um erro ao processar a solicitação. Verifique se você enviou um link válido do TikTok.\nErro: ${error.message}`
        );
      }
      break;


    case "igstory":

      if (!g.body.includes("instagram.com") && !g.body.includes("|")) {
        return b.sendReply(
          `Você precisa enviar um link válido do insta e escolher o número do stories baixado!\nExemplo: ${PREFIX + command} https://www.instagram.com/storieslink | 2`
        );
      }

      try {
        logger.info("[ IGLD ] - D: Baixando do Insta...");

        const response = await axios.get(
          `${BASEURL}download/instagram/?link=${g.body.slice(9)}`
        );

        b.sendWaitReply()
        var opc = parseInt(args[args.length - 1]) - 1

        m.video(response.data[opc].url)
        logger.warn("[ IGDL ] - Dc: Video enviado com êxito!");
      } catch (error) {
        b.sendOwnerError(error.message);
        b.sendReply(
          `Ocorreu um erro ao processar a solicitação. Verifique se você enviou um link válido do TikTok.\nErro: ${error.message}`
        );
      }
      break;

    case "facebook":
      if (!g.body.includes("facebook.com")) {
        return b.sendReply(
          `Você precisa enviar um link válido do face!\nExemplo: ${PREFIX + command} https://www.facebook.com/procure1amigo/videos/uma-compila%C3%A7%C3%A3o-de-v%C3%ADdeos-engra%C3%A7ados-para-voc%C3%AA-rir-muito/707110023106155/?locale=pt_BR`
        );
      }

      try {
        logger.info("[ FBLD ] - D: Baixando do face...");

        const response = await axios.get(
          `${BASEURL}download/facebook/?link=${g.body.slice(10)}`
        );

        b.sendWaitReply()
        m.video(response.data[0].url)
        logger.warn("[ FBDL ] - Dc: Video enviado com êxito!");
      } catch (error) {
        b.sendOwnerError(error.message);
        b.sendReply(
          `Ocorreu um erro ao processar a solicitação. Verifique se você enviou um link válido do TikTok.\nErro: ${error.message}`
        );
      }
      break;
    case "tiktok":
    case "tiktokdl":
      if (!g.body.includes("tiktok.com")) {
        return b.sendReply(
          `Você precisa enviar um link válido do TikTok!\nExemplo: ${PREFIX}tiktok https://tiktok.com/fruvenvivfs`
        );
      }

      try {
        logger.info("[ TTKDLD ] - D: Baixando do TikTok...");

        const response = await axios.get(
          `${BASEURL}download/tiktok/?link=${g.body.slice(8)}`
        );

        m.image(
          response.data.capa,
          `📹 *TikTok Video*\n\n🧾 *Descrição:* ${response.data.desc}\n🌎 *Região:* ${response.data.regiao}\n👤 *Criador:* ${response.data.criadorVideo}`
        );

        m.video(response.data.videoSemMarca);
        logger.warn("[ TTKDLD ] - Dc: Video enviado com êxito!");
      } catch (error) {
        b.sendOwnerError(error.message);
        b.sendReply(
          `Ocorreu um erro ao processar a solicitação. Verifique se você enviou um link válido do TikTok.\nErro: ${error.message}`
        );
      }
      break;

    case "tiktokaudio":
      if (!g.body.includes("tiktok.com")) {
        return b.sendReply(
          `Você precisa enviar um link válido do TikTok!\nExemplo: ${PREFIX}tiktokaudio https://tiktok.com/fruvenvivfs`
        );
      }

      try {
        // Fazer a requisição à API para baixar o áudio do TikTok
        const response = await axios.get(
          `${BASEURL}download/tiktok/?link=${g.body.slice(13)}`
        );

        // Enviar imagem com informações do vídeo do TikTok
        m.image(
          response.data.capa,
          `🎵 *Descrição:* ${response.data.desc}\n🌎 *Região:* ${response.data.regiao}\n🙋 *Criador:* ${response.data.criadorVideo}`
        );

        // Enviar o áudio do vídeo do TikTok
        m.audio(response.data.audio);
      } catch (error) {
        // Lidar com erros na API ou na requisição
        b.sendReply(
          `Ocorreu um erro ao processar a solicitação. Verifique se você enviou um link correto do TikTok.\nErro: ${error.message}`
        );
      }
      break;
    case "teste":
      console.log(isAudio);
      break;
    case "ytmp3":
      // Verificar se foi fornecido um link do YouTube
      if (!g.body.includes("youtu")) {
        return b.sendReply(
          `Você precisa enviar um link válido do YouTube!\nExemplo: ${PREFIX}ytmp3 https://youtu.be/uTxLXyCwey8`
        );
      }
      b.sendWaitReply();
      //  console.log(body.slice(7))
      m.audio(`${BASEURL}download/yt/ytmp3/?link=${g.body.slice(7)}`);
      break;
    case "ytmp4":
      if (!g.body.includes("youtu")) {
        return b.sendReply(
          `Você precisa enviar um link válido do YouTube!\nExemplo: ${PREFIX}ytmp3 https://youtu.be/uTxLXyCwey8`
        );
      }
      b.sendWaitReply();

      m.video(`${BASEURL}download/yt/ytmp4/?link=${g.body.slice(7)}`);
      break;

    ////////////////////fim////////////////////////

    ////////////////////EPHOTO////////////

    case "dragonball":
    case "grafite":
    case "fire":
    case "moon":
    case "coffee":
    case "lolaviso":
    case "amongbanner":
    case "pubglogo":
    case "pubggbanner":
    case "yasuologo":
    case "lol":
      if (!args.join(""))
        return b.sendReply(
          `Você precisa enviar um texto para utilizar esse comando!! \n\n *Exemplo:* ${PREFIX + command
          } ${BOT_NAME}`
        );
      try {
        b.sendWaitReply();
        m.image(
          `${BASEURL}logos/ephoto/${command}/?text=${args.join(" ")}`,
          `*ephoto:* ${command}`
        );
      } catch (err) {
        b.sendReply(`Ocorreu um erro: ${err}`);
      }
      break;
    case "amongus":
      if (!g.body.includes("|"))
        return b.sendReply(
          `Você precisa enviar dois textos separados por | para utilizar esse comando!! \n\n *Exemplo:* ${PREFIX + command
          } ${BOT_NAME + "|" + BOT_NAME}`
        );
      b.sendWaitReply(); 
      try {
        m.image(
          `${BASEURL}logos/ephoto/${command}/?text=${args[0]}&text2=${args[1]}`,
          `*ephoto:* ${command}`
        );
      } catch (err) {
        b.sendReply(`Ocorreu um erro: ${err}`);
      }
      break;
    case "pubgvideo":
      if (!args.join(""))
        return b.sendReply(
          `Você precisa enviar um texto para utilizar esse comando!! \n\n *Exemplo:* ${PREFIX + command
          } ${BOT_NAME}`
        );
      b.sendWaitReply();
      try {
        r.sendWaitReact();
        await axios
          .get(`${BASEURL}logos/ephoto/${command}/?text=${args.join(" ")}`)
          .then(async (res) => {
            let videop = res.data.resultado.imageUrl;
            await m.video(videop, `*ephoto:* ${command}`);
          });
      } catch (err) {
        b.sendReply(`Ocorreu um erro: ${err}`);
      }
      break;
    case "messi":
    case "neymar":
    case "chelsea":
    case "scholes":
      if (!g.body.includes("|"))
        return b.sendReply(
          `Você precisa enviar um texto e um numero para utilizar esse comando!! \n\n *Exemplo:* ${PREFIX + command
          } ${pushname} | 10`
        );
      try {
        b.sendWaitReply();
        m.image(
          `${BASEURL}logos/ephoto/${command}/?text=${args[0]}&text2=${args[1]}`,
          `*ephoto:* ${command}`
        );
      } catch (err) {
        b.sendReply(`Ocorreu um erro: ${err}`);
      }
      break;
    ///////////////////////FIM//////////////

    /////////////////////FUN/////////////////////
    case "amv":
      try {
        const response = await axios.get(`${BASEURL}fun/amv`);
        const jsonData = response.data.amv;
        const randIndex = Math.floor(Math.random() * jsonData.length);
        const randKey = jsonData[randIndex];
        b.sendWaitReply();
        await m.video(randKey.resultado);
      } catch (err) {
        b.sendReply(`Ocorreu um erro: ${err}`);
      }
      break;

    case "beleza":
      // Função para gerar um número aleatório entre min e max (inclusive)
      const getRandomNumber = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

      // Gerar um número aleatório entre 1 e 100 para representar a porcentagem de beleza
      const beautyPercentage = getRandomNumber(1, 100);

      // Definir a categoria de beleza com base no número gerado
      let beautyCategory;
      if (beautyPercentage < 20) {
        beautyCategory = "ESPELHO QUEBROUKKKKKKKKKKKKK 😅";
      } else if (beautyPercentage >= 20 && beautyPercentage <= 50) {
        beautyCategory = "Dragãokkkkkkkkk 🐉";
      } else if (beautyPercentage >= 51 && beautyPercentage <= 59) {
        beautyCategory = "Melhor que nada 🧐";
      } else if (beautyPercentage >= 60 && beautyPercentage <= 68) {
        beautyCategory = "Parece o beiçola 😳😳😳";
      } else if (beautyPercentage > 69) {
        beautyCategory = "Eitaaaa 😳";
      } else {
        beautyCategory = "Parece um pão de queijo 🥐";
      }

      const imageUrl = [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh3VxcZVphyA8nOvwFaB2t2-T2K0Ua2vjxGA&usqp=CAU",
        "https://imageproxy.ifunny.co/crop:x-20,resize:640x,quality:90x75/images/3f4f29454cb495dcc72c329a2616426cb1760fdbae55d7428a356c353c669ced_1.jpg",
        "https://pbs.twimg.com/media/Fl0OtP2WIAMLKOI.jpg",
        "https://img.ifunny.co/images/3ea267154003accd7285d8fb81660a311d5469516f1da4f3a61d24d72da894c6_1.webp",
        "https://pbs.twimg.com/media/FrsplWIXgAErVE6?format=jpg&name=medium",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXl9_wIP_ZS0ygFBUY-hs6_JQ21lumDNobJw&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtEL3ZEU6RsrpOrF3EijOmD8aGKo_H4qMMbQ&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2sd9wwxqL6U9HLr10BiaViNqrP0Gj-fQk-Q&usqp=CAU",
        "https://pbs.twimg.com/media/Fo2_SNgWAAEclfy.jpg",
        "https://img.ifunny.co/images/94f27361d0d8319745bf58c2fc91ba15a9a44f2e19a14dfb948367a7e3078cbd_1.jpg",
        "https://zaplinksbrasil.com.br/wp-content/uploads/2020/12/47f06836c1717ebae8c5998029bbe27e.jpg",
      ];

      const message = `O nível de sua beleza é ${beautyPercentage}%\n\n${beautyCategory}`;
      var mention = g.userMentioned || g.participant;
      b.sendTextWithMention(
        `🚨 *Atenção* 🚨\n @${mention.split("@")[0]
        } você foi convocado para um teste de beleza 🤨🔍\n\nConfira abaixo os resultados.`,
        [mention]
      );

      setTimeout(() => {
        m.image(imageUrl[getRandomNumber(0, imageUrl.length - 1)], message);
      }, 1000);
      break;
    case "correio":
      txt = g.body.slice(9);
      nmr = args[0];
      txt = args[1];
      if (!nmr || !txt)
        return b.sendReply(
          `Você deve usar da seguinte forma ${PREFIX}correio 5559xxxx / mensagem`
        );
      if (g.body.includes("-") || g.body.includes("+"))
        return b.sendReply(
          "Tem que ser o número junto sem +, e não pode tá separado da /"
        );
      bla = `
  ╭┄━┄━┄━┄━┄━╮
	┞┧ ⸙. ͎۪۫          💌  ː͡₊ꞋꞌꞋꞌ
	┞┧  Correio anônimo. 
	┞┧  Msg: ${args[1]}
	┞┧
	╰┄━┄━┄━┄━┄━╮`;
      bot.sendMessage(`${args[0]}@s.whatsapp.net`, { text: bla });
      b.sendText(`Mensagem anonima enviada`)
      break;
    case "idgp":
      b.sendReply(`O meu id do grupo é: 	${remoteJid}`);
      break;

    case "gay":
      {
        const random = Math.floor(Math.random() * 100);
        const bo =
          random < 20
            ? "hm... você é hetero 😔"
            : random >= 31 && random <= 40
              ? "tenho minha desconfiança...😑"
              : random >= 41 && random <= 49
                ? "você é né?😏"
                : random === 50
                  ? "você é ou não?🧐"
                  : random > 50
                    ? "você é gay🙈"
                    : "+/- boiola";

        const gayimage = [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgu8tZg11UYN-svno06EB8uBDyXOwD8td1Hg&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg7TmKRznW-yFG4u4je6UHAH5wzTFN2MB2Ng&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg7TmKRznW-yFG4u4je6UHAH5wzTFN2MB2Ng&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVh2W0mFbs_37puEattL5B5YqNcVxTXoWVXA&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZaP5F6n_lHk0QUCeWkuqvG8d38ODOVwysNQ&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHkIAGcrU6hOY1XcdijhAh8aoKObzNlQPsAA&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyjZ9ohakuQNAqyDHxiNcogdOHWR110mAk-A&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuhew0Pd6lPLzJfY1v6B4SQdENnMCTQj-EkA&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNCpnmQ3vJo6QUfWf0JVqL8T5WA6LyUh-7lA&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCS1-pgEjLC7GMG4BTpDsffA5oXy1RTrJFgQ&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_sIG1Bd_KX2WWnIiMSfbkwX8cB1Yxb4qdmA&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh3VxcZVphyA8nOvwFaB2t2-T2K0Ua2vjxGA&usqp=CAU",
        ];

        let rphoto = Math.floor(Math.random() * gayimage.length);
        var mention = g.userMentioned || g.participant;
        // console.log(mention);

        b.sendTextWithMention(
          `Pipipi pipipi🚨🚨🚨\n\n Sensor gay lhê convoca para um teste @${mention.split("@")[0]
          }...\n Será que você será explanado?? 😨😏🤭`,
          [mention]
        );

        setTimeout(() => {
          m.image(gayimage[rphoto], `Você é ${random}% Gay\n\n${bo}`);
        }, 1000);
      }
      break;
    case "gostosa":
      {
        let links = [
          "https://img.ifunny.co/images/baec88ef2356a1ff67fa5856f416f08520cc77fa0625f54282c54e7fc603d5a4_1.jpg",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREj9CQHYzVW3CDBMn1ccM5nfwRkQPEV0gd-w&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8fEBKLXskYHWPicSrqySrktUvUD1t1LVlfg&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRxAH5SiiChjAVcE2zlG-pBRmnKSzBrYZowA&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRxAH5SiiChjAVcE2zlG-pBRmnKSzBrYZowA&usqp=CAU",
          "https://imgb.ifunny.co/images/29d3f1c9e4616ea77d712176e44809a5182550e61fd2f803e7fe014429123b34_1.webp",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXWUvzO3Oighag4zwVwU4CmZM4opB9Kpz_8g&usqp=CAU",
          "https://i.pinimg.com/736x/17/8b/9d/178b9d1256c052f98133f664702b1c74.jpg",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr-6JCHKVNv7AwIs4DZBuViscj5wa_n3F4mw&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8mW_xcwWfAnDE7IuoMoyX3vvZbqPQuWIm5w&usqp=CAU",
          "https://pm1.aminoapps.com/7289/605598859d062c09d7406f0f90894c812cdb0f33r1-1024-1036v2_uhq.jpg",
        ];

        random = `${Math.floor(Math.random() * 100)}`;
        boiola = random;
        bo =
          boiola < 20
            ? (bo = "reprovou, você é uma tabuaKKKKKKKKKKKKK")
            : boiola == 21 || (boiola >= 30 && boiola <= 40)
              ? (bo = "reprovou, palito de picolékkkkkkkkk")
              : boiola >= 41 && boiola <= 49
                ? (bo = "eu pegava 😳😳😳")
                : boiola == 50
                  ? "na média, quem ignora buraco é prefeitura"
                  : boiola >= 51 && boiola <= 60
                    ? (bo = "aprovou,gostosa hein 😳")
                    : boiola >= 61 && boiola <= 70
                      ? (bo = "aprovou, gostosa igual um churrasco 😳😳")
                      : boiola > 70
                        ? (bo =
                          "se gostosura fosse futebol, você seria o cristiano ronaldo 😳😳")
                        : (bo = "você é aceitável 🧐");
        var mention = g.userMentioned || g.participant;

        b.sendTextWithMention(
          `🚨🚨🚨 pipipipi pipipi🚨🚨🚨\n\n Você foi convidado(a) para um teste @${mention.split("@")[0]
          }...\n Será que você será aprovado(a)?? 😨😏🤭`,
          [mention]
        );

        setTimeout(() => {
          m.image(
            links[Math.floor(Math.random() * links.length)],
            `Você possui ${random}% de gostosura🤤 \n\n${bo}`
          );
        }, 1000);
      }
      break;
    case "report":
    case "reportar":
      if (!args.join(""))
        return b.sendReply(
          "O que você deseja reportar ao meu dono? Em caso de spam o usuário será banido permanentemente do bot!"
        );
      b.sendOwnerMessage(
        `🚨 *COMANDO REPORT* 🚨 \n\n 👤 *Usuário*: wa.me/${g.participant.split("@")[0]
        }\n📜 *Mensagem*: ${args.join("")}`
      );
      b.sendReply(
        "Mensagem enviada ao meu dono! Em caso de spam, você será advertido e/ou até banido"
      );
      break;
    case "sugerir":
    case "sugestão":
      if (!args.join(""))
        return b.sendReply(
          "O que você deseja sugerir ao meu dono? Em caso de de mensagens sem sentido, você podera ser banido !"
        );
      b.sendOwnerMessage(
        `🚨 *COMANDO SUGESTÃO* 🚨 \n\n 👤 *Usuário*: wa.me/${g.participant.split("@")[0]
        }\n📜 *Mensagem*: ${args.join("")}`
      );
      b.sendReply(
        "Mensagem enviada ao meu dono! Em caso de mensagens sem sentido ou brincadeiras você será advertido e/ou até banido"
      );
      break;
    case "avalie":
    case "avaliar":
      if (!args.join(""))
        return b.sendReply(
          "Como você gostaria de avaliar nosso bot? Digite sua opiniião após o comando."
        );
      b.sendOwnerMessage(
        `🚨 *COMANDO SUGESTÃO* 🚨 \n\n 👤 *Usuário*: wa.me/${g.participant.split("@")[0]
        }\n📜 *Avaliação*: ${args.join("")}`
      );
      b.sendReply(
        "Mensagem enviada ao meu dono! Em caso de uso indevido avocê será advertido e/ou até banido"
      );
      break;
    case "linkgp":
      if (!isAdmins) return b.sendReply(response.isAdmins);
      if (!isGroup) return b.sendReply(response.isGroup);
      if (!isBotAdmins) return b.sendReply(response.isBotAdmins);
      linkgc = await bot.groupInviteCode(remoteJid);
      b.sendReply(
        "🔗 LINK OFICIAL DO GRUPO: 👇🏻\n\n https://chat.whatsapp.com/" + linkgc
      );
      break;

    case "pau":
      let tamanho = `${Math.floor(Math.random() * 42)}`;
      if (tamanho < 5) {
        pp = "kkkkkkkkkkkkkkkkkkkk";
      } else if (tamanho == 5 || tamanho == 6) {
        pp = "parece uma minhoquinha";
      } else if (tamanho == 7 || tamanho == 8) {
        pp = "5 só de fimose";
      } else if (tamanho == 9 || tamanho == 10) {
        pp = "na china é Rei 👑";
      } else if (tamanho == 11 || tamanho == 12) {
        pp = "acariciador de xota";
      } else if (tamanho == 13 || tamanho == 14) {
        pp = "passou da média😳";
      } else if (tamanho == 15 || tamanho == 16) {
        pp = "eita, vai pegar manga?";
      } else if (tamanho >= 17 && tamanho <= 19) {
        pp = "calma man, a mina não é um poço😳";
      } else if (tamanho >= 20 && tamanho <= 24) {
        pp = "você tem um poste no meio das pernas";
      } else if (tamanho >= 25 && tamanho <= 29) {
        pp = "Opa, você é um cavalo de guerra";
      } else if (tamanho >= 30 && tamanho <= 35) {
        pp = "deixou " + Math.floor(Math.random() * 15) + " cadeirantes";
      } else {
        pp = "que porra é essa kkkkkkkkkkkk";
      }

      const imageLinks = [
        "https://avowhcbwko.cloudimg.io/v7/https://empreender.nyc3.digitaloceanspaces.com/grupowhats/f1500373b6f25c3acba01d59e1a30cf7?w=400&org_if_sml=1",
        "https://img.ifunny.co/images/d61d2732047202676fc897851273ae6b1be424376bf68ca8363bbd2016a7742d_1.jpg",
        "https://i.ytimg.com/vi/-uVXDCvSJ9U/mqdefault.jpg",
        "https://imageproxy.ifunny.co/crop:x-20,resize:640x,quality:90x75/images/448da75897eeafcf279f41ac1cf6523def00c467324add8fc60336b8fdb07587_1.jpg",
        "https://img.ifunny.co/images/3dc1ad2bd298ca2ad7d18b3c6cc04f7b5f064c9feec3630367cb3fea7bd79369_1.jpg",
        "https://pbs.twimg.com/media/FpEa5GlXgAMSx2o.jpg",
        "https://img.ifunny.co/images/f0ede0d5f411db90315e6860ef7f8b7ff581475b63ea2c9fbb8379c268a4e0d8_1.jpg",
        "https://rvideos2.memedroid.com/videos/UPLOADED822/63d140191bf8b.webp",
        "https://i.pinimg.com/200x/d7/75/d4/d775d4ebde48f331abf426b459a3bdde.jpg",
        "https://pbs.twimg.com/media/Ftt0pllWAAACbdj.jpg",
        "https://img.ifunny.co/images/039e28912d207b043e05747e11c4d9e8182b4480db64d81d609e68cae155ff59_3.jpg",
        "https://i.ytimg.com/vi/ehwg6nMBqKw/maxresdefault.jpg",
        "https://imageproxy.ifunny.co/crop:x-20,resize:640x,quality:90x75/images/2cb6115b60f69a444dba8b3e56a17d771bb76b7537e2b887b94bfe39601a70a5_1.jpg",
        "https://imageproxy.ifunny.co/resize:640x,quality:90x75/images/260c13809eb1916e2bbcf7f714d5117d5d2f1f4d310e8dd17996099bd5ba786d_3.jpg",
        "https://images3.memedroid.com/images/UPLOADED779/63616e6f4534a.jpeg",
        "https://pbs.twimg.com/media/FzY_ZqQX0AY9Vzp.jpg",
        "https://i.pinimg.com/736x/67/24/c5/6724c55919ef6d9e4081307b6fa5bb73.jpg",
      ];
      var mention = g.userMentioned || g.participant;

      b.sendTextWithMention(
        `🚨 *Atenção* 🚨\n @${mention.split("@")[0]
        } Vamos tirar suas medidas 🔍🔍🔍 \n\n Confira abaixo os resultados.`,
        [mention]
      );

      let rand = Math.floor(Math.random() * imageLinks.length);

      setTimeout(() => {
        m.image(imageLinks[rand], `Você tem ${tamanho}cm de tora\n\n${pp}`);
      }, 1000);
      break;

    case "gado":
    case "gadometro":
      const gados = [
        "🐮 Ultra Extreme Gado",
        "🐮 Gado-Master",
        "🐮 Gado-Rei",
        "🐮 Gado-Rei Mestre",
        "🐮 Gado",
        "🐮 Escravo-ceta",
        "🐮 Escravo-ceta Máximo",
        "🦄 Gacorno?",
        "🦄 Gacorno Mestre",
        "🦄 Jogador De Forno Livre<3",
        "🍔 Mestre Do Frifai<3<3",
        "🐄 Gado-Manso",
        "🐄 Gado-Conformado",
        "🐄 Gado-Incubado",
        "🐄 Gado Deus",
        "🥇 Mestre dos Gados",
        "🥇 Topa Tudo por Buceta",
        "🐄 Gado Comum",
        "🐄 Mini Gado",
        "🐄 Mini Gado Comum",
        "🐄 Mini Gadinho",
        "🐄 Gado Iniciante",
        "🐄 Gado Básico",
        "🐄 Gado Intermediário",
        "🐄 Gado Avançado",
        "🐄 Gado Profissional",
        "🐄 Gado Mestre",
        "🐄 Gado Chifrudo",
        "🥈 Corno Conformado",
        "🥈 Corno HiperChifrudo",
        "🥈 Corno Mestre",
        "🥈 Corno",
        "🦌 Chifrudo Conformado",
        "🦌 Chifrudo HiperChifrudo",
        "🦌 Chifrudo Mestre",
        "🦌 Chifrudo Deus",
        "🥇 Mestre dos Chifrudos",
        "🥇 Mestre dos Gados",
        "👑 Rei do Gado",
        "👑 Rei Chifrudo",
        "👑 Rei Corno",
        "👑 Rei Gado",
        "👑 Calma mano, ela é diferente",
      ];

      // Selecionar um gado aleatório
      const gado = gados[Math.floor(Math.random() * gados.length)];

      // Gerar um número aleatório entre 0 e 100 para representar a porcentagem de gado
      const gadoPercentage = Math.floor(Math.random() * 101);

      let links = [
        "https://images3.memedroid.com/images/UPLOADED285/5f75275e36c9f.jpeg",
        "https://i.pinimg.com/1200x/fc/8c/5a/fc8c5a7360395144a477492da320aff3.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyyA37UXAWEHlVihUg1Z_7LqJ3hYIZqZjOVA&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7siEOfYwdEty6XWv5xzozzzO7vncisAwyhA&usqp=CAU",
        "https://i.pinimg.com/236x/36/6f/a7/366fa711386454b111c02a52c3305f41.jpg",
        "https://img.ifunny.co/images/ef1e1001eeb6b7486889a3d61b076070865640a942ac5eb2f6acf8a94f09a617_1.jpg",
        "https://i.pinimg.com/736x/7c/99/ff/7c99ff114025a244d53a5e5790ae4625.jpg",
        "https://images3.memedroid.com/images/UPLOADED137/5e0a2eb2e51e8.jpeg",
        "https://img.ifunny.co/images/0264b3beed5f5a486f4ce1b6fdcaa3f70f020e6a7dde6be0137c9be675f66bb8_1.jpg",
        "https://avowhcbwko.cloudimg.io/v7/https://empreender.nyc3.digitaloceanspaces.com/grupowhats/3ef1a78f62e2acb1f4a3e20a9611586e?w=400&org_if_sml=1",
        "https://img.ifunny.co/images/583d5d36fc5e9b6239e77e5487667b04fee61cd97cb1aa41ffb0a50653570eab_1.jpg",
        "https://images3.memedroid.com/images/UPLOADED259/5e8e34f83f329.jpeg",
        "https://i.pinimg.com/736x/c2/85/1a/c2851a25f234f7121103765a0d680a01.jpg",
      ];
      let ale = Math.floor(Math.random() * links.length);
      const messag = `Você é:\n\n${gado}\n\nTamanho do Chifre: ${gadoPercentage}% 🤠`;
      var mention = g.userMentioned || g.participant;

      b.sendTextWithMention(
        `🚨 *Atenção* 🚨\n @${mention.split("@")[0]
        }  Vamos analisar seu chifre 🧑‍⚕️`,
        [mention]
      );

      setTimeout(() => {
        m.image(links[ale], messag);
      }, 1000);
      break;
    case "chance":
      {
        if (!args.join(" ")) {
          return b.sendReply(
            `Você precisa enviar uma pergunta!\nEx: ${PREFIX}chance de vc ser humano?`
          );
        }
        random = `${Math.floor(Math.random() * 100)}`;
        b.sendReply(
          `Tudo bem... Tudo bem, acredito que a chance  ${args.join(
            " "
          )} \n\né de... ${random}%`
        );
      }
      break;
    case "meme":
      b.sendWaitReply();

      try {
        b.sendWaitReply();
        m.image(`${BASEURL}fun/meme`, "🤓☝️");
      } catch (err) {
        b.sendReply(`Ocorreu um erro: ${err}`);
      }
      break;
    case "metadinha":
      {
        b.sendWaitReply();

        axios
          .get(`${BASEURL}fun/metadinha`)
          .then(async (metadinha) => {
            const aleatorio = Math.floor(Math.random() * (145 - 0 + 1)) + 0;
            b.sendReply(`_Suas metadinhas foram *geradas com sucesso*!_`);
            await m.image(
              metadinha.data.metad.metadinhas[aleatorio].male,
              `_Metadinha masculina_ ☀️\n*#${aleatorio}*`
            );
            await m.image(
              metadinha.data.metad.metadinhas[aleatorio].female,
              `_Metadinha feminina_ 🌕\n*#${aleatorio}*`
            );
          })
          .catch((err) => {
            b.sendReply(`Ocorreu um erro: ${err}`);
          });
      }
      break;
    case "morte":
      {
        idde = [
          "30",
          "23",
          "29'",
          "76",
          "90",
          "78",
          "72",
          "74",
          "75",
          "83",
          "73",
          "83",
          "74",
          "92",
          "100",
          "94",
          "48",
          "37",
          "53",
          "63",
        ];
        idade = idde[Math.floor(Math.random() * idde.length)];
        b.sendReply(
          `◤━━━━━━━☆. ☠️ .☆ ━━━━━━━◥
                    *Verificador de Morte*
     * Pessoas com este nome: *${pushname}* \n * Tendem a morrer aos ${idade} anos de idade.  `
        );
      }
      break;
    case "pergunta":
      {
        if (!args.join(" ")) {
          return b.sendReply(
            `Você precisa enviar uma pergunta!\nEx: ${PREFIX}pergunta vc é humano?`
          );
        }

        const sn = ["sim", "não"];
        const per = sn[Math.floor(Math.random() * sn.length)];

        b.sendReply(
          `*Pergunta:* ${args.join(
            " "
          )}\n\nSegundo meus cálculos, eu acredito que... ${per}`
        );
      }
      break;
    case "piada":
      {
        b.sendWaitReply();

        try {
          axios.get(`${BASEURL}fun/piada`).then((res) => {
            b.sendReply(
              "                 *Contador de Piadas* 🤓\n\n *Piada:*  " +
              res.data.joke.replace(/\|\|/g, "\n\n")
            );
          });
        } catch (err) {
          b.sendReply(`Ocorreu um erro: ${err}`);
        }
      }
      break;
    //////////////////////FIM////////////////////

    //////////////////////JOGOS///////////////////

    ///////////////FIM///////////////////////////

    /////////////////////////IA//////////////////////
    case "evo":
    case `${BOT_NAME}`:
    case "gpt":
    case "bot":
      {
        if (!args.join(" ")) {
          return b.sendReply(
            `Você precisa enviar uma mensagem!\nEx: ${PREFIX}${BOT_NAME} qual o sentido da vida?`
          );
        }
        axios
          .get(`${BASEURL}ia/autoreply/?msg=${args.join(" ")}`)
          .then((res) => {
            b.sendWaitReply();
            b.sendReply(res.data.texto);
          });
      }
      break;

    case "simi":
    case "simsimi":
      {
        if (!args.join(" ")) {
          return b.sendReply(
            `Você precisa enviar uma mensagem!\nEx: ${PREFIX}simi ola?`
          );
        }
        axios
          .get(`${BASEURL}ia/simsimi/?text=${args.join(" ")}`)
          .then((res) => {
            b.sendReply(res.data.texto.message);
          });
      }
      break;

    case "gameofthrones":
    case "drake":
    case "distracted":
    case "twobuttons":
    case "changemymind":
    case "slap":
    case "left":
    case "uno":
    case "running":
    case "notsimply":
    case "bobesponja":
    case "skeleton":
    case "ancient":
    case "buzz":
    case "dodge":
    case "disaster":
    case "rollsafe":
    case "futurama":
    case "blankbutton":
    case "barnie":
    case "pikachu":
    case "poo":
    case "dicaprio":
    case "mostinteresting":
    case "15years":
    case "therock":
    case "pigeon":
    case "doge":
    case "handshake":
    case "puppet":
    case "escobar":
    case "finding":
    case "wonka":
    case "grumpycat":
    case "yuno":
    case "tom":
    case "samepicture":
    case "kermit":
    case "yoda":
    case "hannibal":
    case "otherwoman":
    case "kermitdrink":
    case "mytrophy":
    case "headout":
    case "fine":
    case "facepalm":
    case "matrix":
    case "smallowpills":
    case "picardwtf":
    case "realshit":
    case "meninsuits":
    case "laughingleo":
    case "gun":
    case "waither":
    case "patrik":
    case "belikebill":
    case "jokedog":
    case "happybobesponja":
    case "sparrow":
    case "sparta":
    case "cat":
      {
        if (args.length < 2)
          return b.sendReply(
            ` Você precisa enviar dois textos separados por / ou | para utilizar esse comando!! \n\n *Exemplo: *${PREFIX + command
            } ${BOT_NAME}`
          );
        b.sendWaitReply();
        try {
          m.image(
            `${BASEURL}fun/imgflip/${command}/?text=${args[0]}&text2=${args[1]}`,

            `*ImgFlip:* ${command}`
          );
        } catch (err) {
          b.sendReply(`Ocorreu um erro: ${err}`);
        }
      }
      break;
    case "toanime":
    case "sketch":
    case "tocartoon":
      {
        if (!isImage) return b.sendReply(response.noImg);
        b.sendWaitReply();
        try {
          const inputPath = await downloadImage(msg, "input");
          const imagetoLink = await upload(inputPath);

          // Efeito de blur aplicado
          let type;

          switch (command) {
            case "toanime":
              type = "anime";
              break;
            case "sketch":
              type = "sketch";
              break;
            case "tocartoon":
              type = "3d";
              break;
          }
          const options = {
            method: "POST",
            url: "https://3d-cartoon-face.p.rapidapi.com/run",
            headers: {
              "content-type": "application/json",
              "X-RapidAPI-Key":
                "01636c10f7msh4b05f5ff4263b66p1528acjsn23a7f91b83fa",
              "X-RapidAPI-Host": "3d-cartoon-face.p.rapidapi.com",
            },
            data: {
              image: imagetoLink,
              render_mode: type,
              output_mode: "url",
            },
          };

          try {
            const response = await axios.request(options);
            m.image(
              response.data.output_url,
              `🖼️ _Aqui está sua imagem com efeito *${command}*, ${pushname}!_`
            );
          } catch (error) {
            console.error(error);
          }
        } catch (err) {
          console.log(err);
        }
      }
      break;

    ////////////////////////////FIM////////////////////////////////

    ///////////////////////////INTERAÇÃO/////////////////////////
    case "casal":
      {
        {
          if (!isGroup) return b.sendReply(response.isGroup);

          let member = participants.map((u) => u.id);
          let ela = member[Math.floor(Math.random() * member.length)];
          let ele = member[Math.floor(Math.random() * member.length)];
          r.sendWaitReact();

          b.sendTextWithMention(
            `FORMADOR DE CASAIS
            segundo meus cálculos, @${ele.split("@")[0]} e @${ela.split("@")[0]
            } formam um belo casal👀`,
            [ele, ela]
          );
        }
      }
      break;
    case "abraco":
    case "beijo":
    case "chute":
    case "carinho":
    case "tapa":
      {
        if (!isGroup) return b.sendReply(response.isGroup);

        if (g.isMentionRequired || g.userMentioned === undefined) {
          return b.sendReply(
            `Você precisa marcar alguém para usar este comando! \n Ex: ${PREFIX + command
            } @membro`
          );
        }
        b.sendWaitReply();
        const fig = (cmd) => {
          r.sendWaitReact();
          axios.get(`https://api.waifu.pics/sfw/${cmd}`).then((res) => {
            const outputPath = path.resolve(TEMP_DIR, "output.webp");

            let link = res.data.url;
            exec(
              `ffmpeg -i ${link} -y -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512,fps=12,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -f webp ${outputPath}`,
              async () => {
                await b.sendTextWithMention(
                  `Você deu um ${command} em @${g.userMentioned.split("@")[0]}`,
                  [g.userMentioned]
                );
                await m.sendStickerFromFile(outputPath);

                fs.unlinkSync(outputPath);
              }
            );
          });
        };

        switch (command) {
          case "abraco":
            fig("hug");
            break;
          case "beijo":
            fig("kiss");
            break;
          case "chute":
            fig("kick");
            break;
          case "tapa":
            fig("slap");
            break;
          case "chute":
            fig("kick");
            break;
          case "carinho":
            fig("cuddle");
            break;
        }
      }
      break;
    case "par":
      {
        if (!isGroup) return b.sendReply(response.isGroup);

        let member = participants.map((u) => u.id);
        let eu = g.participant;
        let outro = member[Math.floor(Math.random() * member.length)];
        r.sendWaitReact();

        b.sendTextWithMention(
          `Segundo meus calculos, o par perfeito para @${eu.split("@")[0]
          } é: @${outro.split("@")[0]} 🙈`,
          [eu, outro]
        );
      }
      break;
    case "sorteio":
      {
        if (!isAdmins) return b.sendReply(response.isAdmins);
        try {
          if (!isGroup) return b.sendReply(response.isGroup);
          if (!q)
            return b.sendReply(
              `Digite o que você quer sortear seguido do comando`
            );
          let d = [];
          let teks = `🎉Parabéns🎉\n Você acaba de ganhar um sorteio!!: ${q}:\n\n`;
          for (i = 0; i < 1; i++) {
            r = Math.floor(Math.random() * participants.length + 0);
            teks += `*Membro:* @${participants[r].id.split("@")[0]}\n`;
            d.push(participants[r].id);
          }
          b.sendTextWithMention(teks, d);
        } catch (e) {
          console.log(e);
          b.sendReply("Deu erro, tente novamente :/");
        }
      }
      break;
    case "ship":
      {
        if (!isGroup) return b.sendReply(response.isGroup);

        if (g.isMentionRequired) return b.sendReply(response.isMentionRequired);
        r.sendWaitReact();

        porq = `${Math.floor(Math.random() * 100)}`;
        m.image(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfx9eiMZaWVBqqrzd5qLKXNK1m43ApsNvVpQ&usqp=CAU",
          `segundo meus cálculos, a chance de ambos namorarem é de ${porq}%`
        ).catch((err) => {
          b.sendReply(`Ocorreu um erro: ${err}`);
        });
      }
      break;
    //////////////////////////FIM ////////////////////////////

    ///////////////////////////MENUS ////////////////////////
    case "comandos":
    case "menu":
      b.sendMenu(menuMessage());
      break;
    case "efeitosaudio":
      b.sendMenu(soundmenu());
      break;
    case "dlmenu":
    case "download":
      b.sendMenu(dlMenu());
      break
    case "papeldeparede":
    case "wallpapermenu":
    case "wallpaper":
      b.sendMenu(papelparede());
      break
    case "menumemes":
    case "memes":
      b.sendMenu(memesMenu());
      break;
    case "memes2":
      b.sendMenu(memes2Menu());
      break;
    case "memes3":
      b.sendMenu(memes3Menu());
      break;
    case "memes4":
      b.sendMenu(memes4Menu());
      break;
    case "menuadm":
    case "admmenu":
    case "admin":
    case "administração":
    case "administracao":
      b.sendMenu(adminMenu());
      break;
    case "futmenu":
      b.sendReply(futMenu())
      break
    case "ferramentas":
      b.sendMenu(toolsMenu());
      break;
    case "jogos":
      b.sendMenu(gameMenu());
      break;
    case "dono":
      b.sendMenu(ownerMenu());
      break;
    case "ia":
    case "iamenu":
      b.sendMenu(iaMenu());
      break;
    case "efeitos":
    case "canvas":
    case "montagens":
      b.sendMenu(efeitosMenu());
      break;
    case "efeitos2":
      b.sendMenu(efeitos2Menu());
      break;
    case "+18":
      b.sendMenu(nsfwMenu());
      break;
    case "brincadeiras":
      b.sendMenu(funMenu());
      break;
    case "searchmenu":
    case "pesquisas":
      b.sendMenu(searchMenu());
      break;
    case "logos2":
      b.sendMenu(logos2Menu());
      break
    case "logos":
      b.sendMenu(logosMenu());
      break
    case "imggenerator":
    case "imagegenerator":
    case "gerarimagem":
    case "gerarimagens":
      {
        b.sendReply(modelosMenu())
      }
      break;
    case "suporte":
    case "criador":
      b.sendReply(`*Provisório:* Entre em contato com: ${owner}`)
      break
    case "hentai":
      {
        if (isGroup && !g.isNsfw) return b.sendReply(response.isNsfw);
        b.sendWaitReply();

        try {
          m.image(
            `${BASEURL}nsfw/${command}`,
            `Aqui está o seu comando, ${pushname}!`
          );
        } catch (err) {
          b.sendReply(`Ocorreu um erro: ${err}`);
        }
      }
      break;

    case "ass":
    case "miakhalifa":
    case "porn":
    case "asiatica":
    case "cosplay":
    case "boobs":
      {
        if (isGroup && !g.isNsfw) return b.sendReply(response.isNsfw);

        b.sendReply(
          `Aguarde... este comando pode demorar  para responder devido a sua hospedagem`
        );
        try {
          axios
            .get(`https://evoo.onrender.com/nsfw/${command}`)
            .then(async (res) => {
              let gifurl = res.data.webm;
              const videoPath = path.resolve(TEMP_DIR, "compress.mp4");

              exec(
                `ffmpeg -i ${gifurl} -c:v libx264 -crf 23 -c:a aac -b:a 128k -y ${videoPath}`,
                (error, stdout, stderr) => {
                  if (error) {
                    logger.error(
                      `[ ERROR ] - ffmpeg: Durante a execução ocorreu: ${error}`
                    );
                    return;
                  }

                  logger.error(`[ FFMPEG ] - Processo concluido comex ito!`);
                  m.gif(videoPath, res.data.title);
                }
              );
            });
        } catch (err) {
          b.sendReply(`Ocorreu um erro: ${err}`);
        }
      }
      break;
    case "searchporngif":
      {
        if (isGroup && !g.isNsfw) return b.sendReply(response.isNsfw);
        if (!args.join(" "))
          return b.sendReply(
            "você precisa digitar algo que queira buscar para utilizar esse comando"
          );

        b.sendReply(
          `Aguarde... este comando pode demorar devido a sua hospedagem`
        );

        try {
          axios
            .get(
              `https://evoo.onrender.com/nsfw/porngifsearch/?text=${args.join(
                " "
              )}`
            )
            .then(async (res) => {
              let gifurl = res.data.webm;
              const videoPath = path.resolve(TEMP_DIR, "compress.mp4");

              exec(
                `ffmpeg -i ${gifurl} -c:v libx264 -crf 23 -c:a aac -b:a 128k -y ${videoPath}`,
                (error, stdout, stderr) => {
                  if (error) {
                    logger.error(
                      `[ ERROR ] - ffmpeg: Durante a execução ocorreu: ${error}`
                    );
                    return;
                  }

                  logger.info("[ FFMPEG ] - Processo concluido com êxito");
                  m.gif(videoPath, res.data.title);
                }
              );
            });
        } catch (err) {
          b.sendReply(`Ocorreu um erro: ${err}`);
          logger.error(
            `[ ERROR ] - ffmpeg: Durante a execução ocorreu: ${error}`
          );
        }
      }

      break;
    /////////////////////////////////////FIM ///////////////////////////

    /////////////PHOTOOXY/////////////
    case "bf4":
    case "pubgbanner":
      {
        if (!g.body.includes("|"))
          return b.sendReply(
            `Você precisa enviar algum texto  separado por | para utilizar esse comando!! \n\n *Exemplo:* ${PREFIX + command
            } evobot`
          );
        b.sendWaitReply();

        try {
          m.image(
            `${BASEURL}logos/photooxy/${command}/?text=${args[0]}&text2=${args[1]}`,
            `*photooxy:* ${command}`
          );
        } catch (err) {
          b.sendReply(`Ocorreu um erro: ${err}`);
        }
      }
      break;
    case "sgoogle":
      {
        if (!args[2])
          return b.sendReply(
            `Você precisa enviar três textos separados por / para utilizar esse comando!! \n\n *Exemplo:* ${PREFIX + command
            } qual é o melhor bot? / ${BOT_NAME} com certeza / sem duvidas o ${BOT_NAME} `
          );
        b.sendWaitReply();

        try {
          m.image(
            `${BASEURL}logos/photooxy/${command}/?text=${args[0]}&text2=${args[1]}&text3=${args[2]}`,
            `*photooxy:* ${command}`
          );
        } catch (err) {
          b.sendReply(`Ocorreu um erro: ${err}`);
        }
      }
      break;

    ////////////////////////////////FIM ///////////////////////////

    //////////////////PREMIUM//////////////////

    case "cpf1":
    case "cpf2":
    case "cpf3":
    case "tel1":
    case "tel2":
    case "tel3":
    case "cns":
    case "placa":
    case "cnpj":
    case "nome":
    case "cep":
      if (!args.join(" ")) {
        return b.sendReply(`Cadê os dados que você deseja buscar?`);
      }

      if (!g.isPremium) return b.sendReply(response.isPremium);
      b.sendWaitReply();

      try {
        const respnse = await queryBy(command, args[0]);
        b.sendReply(respnse);
      } catch (error) {
        b.sendOwnerError(error.message);
        b.sendReply(error.message);
        logger.error(
          "[ p: Consulta ] - Ocorreu um erro ao consultar...",
          error
        );
      }
      break;

    ////////////////////////////////FIM ///////////////////////////

    ////////////////////////////////SEARCH ///////////////////////////

    case "anime":
      {
        if (!args.join(" ")) {
          return b.sendReply(
            `Você precisa enviar uma busca! Ex: ${PREFIX}${command} kimetsu no yaiba`
          );
        }
        b.sendWaitReply();

        axios
          .get(`${BASEURL}search/anime/?text=${args.join(" ")}`)
          .then(async (res) => {
            const animeData = res.data.results;
            if (animeData.notFound) {
              return b.sendReply(
                "Anime não encontrado. Verifique a ortografia e tente novamente."
              );
            }

            const formattedDuration = `${Math.floor(
              animeData.info.duracao / 60
            )}h ${animeData.info.duracao % 60}m`;

            const animeInfo = `🧾 *Título:* ${animeData.outros.titulo}\n ⭐ *Nota:* ${animeData.info.score}\n  📼 *Episódios:* ${animeData.info.episodios} 📺\n ⏳ Duração: ${formattedDuration}\n 📅 *Período de Exibição:* ${animeData.info.data}\n 🎬 *Trailer:* ${animeData.outros.treiler}`;

            await m.image(animeData.outros.img, animeInfo);
            await b.sendReply(
              ` ☢️ *Atenção:* se esse não é o anime que você procura, verifique sua ortografia. \n\n🧾 *Título:* ${animeData.outros.titulo}\n\n✍️ *Sinopse:* ${animeData.info.desc}`
            );
          })
          .catch((err) => {
            b.sendReply(
              `Ocorreu um erro! Você pesquisou corretamente? \n Erro: ${err}`
            );
          });
      }
      break;
    case "epicgames":
    case "jogosgratis":
      {
        try {
          const response = await axios.get(`${BASEURL}search/epic`);
          const currentGames = response.data.epic.currentGames;

          if (currentGames.length === 0) {
            return b.sendReply(
              "Não foram encontrados jogos grátis na Epic Games no momento."
            );
          }
          b.sendWaitReply();

          currentGames.forEach((game) => {
            const imgUrl = game.keyImages.find(
              (image) => image.type === "Thumbnail"
            )?.url;
            const startDate =
              game.promotions.promotionalOffers[0]?.promotionalOffers[0]?.startDate.split(
                "T"
              )[0];
            const endDate =
              game.promotions.promotionalOffers[0]?.promotionalOffers[0]?.endDate.split(
                "T"
              )[0];
            const originalPrice = game.price.totalPrice.fmtPrice.originalPrice;
            const discountedPrice =
              game.price.totalPrice.fmtPrice.discountPrice;

            let message = `🏷️ *Título:* ${game.title}\n🗒️ *Descrição:* ${game.description}\n📅 *Data:* ${startDate} até ${endDate}`;

            if (discountedPrice) {
              message += `\n💲 *Preço Original:* ${originalPrice}\n💰 *Preço com Desconto:* ${discountedPrice}`;
            } else {
              message += `\n💲 *Preço Original:* ${originalPrice}\n🎁 *Jogo Grátis por Tempo Limitado!*`;
            }

            m.image(imgUrl, message);
          });
        } catch (err) {
          b.sendReply(
            "Ocorreu um erro ao buscar os jogos grátis da Epic Games."
          );
        }
      }
      break;
    case "filme":
      {
        // Verifica se o parâmetro de busca foi fornecido
        if (!args[0]) {
          return b.sendReply(
            `Você precisa enviar uma busca! Ex: ${PREFIX}filme kimetsu no yaiba`
          );
        }
        b.sendWaitReply();

        try {
          // Envia uma resposta de espera ao usuário
          // Faz a pesquisa do filme
          const response = await axios.get(
            `${BASEURL}search/filme/?text=${encodeURIComponent(args.join(" "))}`
          );

          // Verifica se a pesquisa retornou algum resultado
          if (!response.data.results || response.data.results.length === 0) {
            b.sendReply("Nenhum filme encontrado para a busca.");
            return;
          }

          // Obtém o primeiro resultado da pesquisa
          const firstResult = response.data.results[0];

          // Envia a imagem e informações do filme
          m.image(
            firstResult.img,
            `🧾 *Título:* ${firstResult.nome}\n⭐ *Nota:* ${firstResult.avaliacao}\n📼 *Link:* ${firstResult.link} \n`
          );

          // Envia uma mensagem de atenção
          b.sendReply(
            "☢️ *Atenção:* Se esse não é o filme que você procura, tente ser mais específico ao digitar o nome."
          );
        } catch (err) {
          // Tratamento de erro em caso de falha na pesquisa
          b.sendReply(
            `Ocorreu um erro ao pesquisar. Verifique se você fez a busca corretamente.\nErro: ${err}`
          );
        }
      }
      break;
    case "github":
      {
        // Verifica se o parâmetro de busca foi fornecido
        if (!args[0]) {
          return b.sendReply(
            `Você precisa enviar uma busca! Ex: ${module.exports.usage}`
          );
        }
        b.sendWaitReply();

        try {
          // Faz a pesquisa do usuário no GitHub
          const response = await axios.get(
            `${BASEURL}stalk/github/?text=${encodeURIComponent(args.join(" "))}`
          );

          // Verifica se a pesquisa retornou algum resultado
          if (!response.data.avatar_url) {
            b.sendReply("Nenhum usuário do GitHub encontrado para a busca.");
            return;
          }

          // Envia a imagem e informações do usuário
          m.image(
            response.data.avatar_url,
            `🧾 *Nome:* ${response.data.name}\n⭐ *Bio:* ${response.data.bio}\n🧑 *Seguidores:* ${response.data.followers}\n🤔 *Seguindo:* ${response.data.following}\n📅 *Criado em:* ${response.data.created_at}\n🕐 *Atualizado em:* ${response.data.updated_at}\n🔗 *URL:* ${response.data.url}\n🏨 *Empresa:* ${response.data.company}\n🗾 *Cidade:* ${response.data.location}\n📁 *Repositórios Públicos:* ${response.data.public_repos}\n`
          );
        } catch (err) {
          // Tratamento de erro em caso de falha na pesquisa
          b.sendReply(
            `Ocorreu um erro ao pesquisar. Verifique se você fez a busca corretamente.\nErro: ${err}`
          );
        }
      }
      break;
    case "google":
      {
        if (!args.join(" ")) {
          return b.sendReply(
            `Você precisa enviar um parâmetro de busca! Ex: ${PREFIX}google kamaitachi`
          );
        }
        b.sendWaitReply();

        try {
          const response = await axios.get(
            `${BASEURL}search/google/?text=${encodeURIComponent(
              args.join(" ")
            )}`
          );
          const results = response.data.results;

          if (results.length === 0) {
            return b.sendReply(
              "Nenhum resultado encontrado para a busca fornecida."
            );
          }

          const txt = results.map((item) => {
            return `🧾 *Título:* ${item.title}\n🔗 *URL:* ${item.link}\n✍️ *Descrição:* ${item.snippet}\n`;
          });

          b.sendReply(
            `_Olá ${pushname}_ 👋🏼\n_Aqui estão os resultados da busca  *${args.join(
              " "
            )}*:_\n\n${txt.join(`${"\u200B".repeat(4000)}`)}`
          );
        } catch (err) {
          b.sendReply(`Ocorreu um erro ao pesquisar no Google. Erro: ${err}`);
        }
      }
      break;
    case "dolar":
    case "euro":
    case "libra":
    case "bitcoin":
    case "ethereum":
      {
        // Mapear os códigos das moedas para a API
        const currencyCodes = {
          dolar: "USD",
          euro: "EUR",
          bitcoin: "BTC",
          libra: "GBP",
          ethereum: "ETH",
        };

        // Verificar se o comando é válido
        if (!currencyCodes[command]) {
          return b.sendReply(
            `Comando inválido! Use um dos comandos disponíveis: ${Object.keys(
              currencyCodes
            )
              .map((cmd) => PREFIX + cmd)
              .join(", ")}`
          );
        }
        b.sendWaitReply();

        try {
          // Fazer a requisição à API para obter a cotação da moeda
          const response = await axios.get(
            `https://economia.awesomeapi.com.br/last/${currencyCodes[command]}-BRL`
          );

          // Verificar se a moeda existe na resposta da API e se há dados
          const currencyData = response.data[`${currencyCodes[command]}BRL`];
          if (!currencyData || Object.keys(currencyData).length === 0) {
            throw new Error(
              "Moeda não encontrada na resposta da API ou dados ausentes."
            );
          }

          // Extrair os dados da cotação
          const { name, high, low, bid } = currencyData;

          // Enviar a mensagem com as informações da cotação
          b.sendReply(`
            📈 *Cotação das Moedas* 💱
    
            Moeda: ${name}
            Valor mais alto: R$ ${Number(high).toFixed(2)}
            Valor mais baixo: R$ ${Number(low).toFixed(2)}
            Valor atual: R$ ${Number(bid).toFixed(2)}
          `);
        } catch (error) {
          // Lidar com erros na API ou na requisição
          b.sendReply(
            `Ocorreu um erro ao obter a cotação da moeda. Verifique se você digitou o comando corretamente.\nErro: ${error.message}`
          );
        }
      }
      break;
    case "searchwallpaper":
      {
        if (!args.join(" ")) {
          return b.sendReply(
            `Você precisa enviar uma busca! Ex: ${PREFIX}${command} kimetsu no yaiba`
          );
        }
        b.sendWaitReply();

        axios
          .get(`${BASEURL}search/searchwallpaper/?text=${args.join(" ")}`)
          .then(async (res) => {
            await m.image(
              res.data.img.image[0],
              `Aqui está o resultado de: *${args.join(" ")}* `
            );
          })
          .catch((err) => {
            b.sendReply(
              `Ocorreu um erro! Você pesquisou corretamente? \n Erro: ${err}`
            );
          });
      }
      break;

    /////////////////////////////FIM////////////////////////

    ////////////////////////TEXTPRO//////////////////////
    case "minecraft":
    case "joker":
    //   case "urso":
    case "holograpic":
    case "blackpink":
    case "verao":
    case "1917":
    case "devil":
    case "thunder":
    case "minions":
    case "batman":
    case "naruto":
    case "greenneon":
    case "glow":
      {
        if (!args.join(" "))
          return b.sendReply(
            `Você precisa enviar um texto para utilizar esse comando!! \n\n *Exemplo:* ${PREFIX + command
            } ${BOT_NAME}`
          );
        b.sendWaitReply();

        try {
          m.image(
            `${BASEURL}logos/textpro/${command}/?text=${args.join(" ")}`,
            `*Text Pro:* ${command}`
          );
        } catch (err) {
          b.sendReply(`Ocorreu um erro: ${err}`);
        }
      }
      break;

    case "wolf":
    case "wolf2":
    case "ninjalogo":
    case "leao":
    case "vingadores":
    case "marvel":
    case "thor":
    case "capitaoamerica":
    case "pornhub":
    case "space":
      {
        if (!g.body.includes("|"))
          return b.sendReply(
            ` Você precisa enviar dois textos separados por | para utilizar esse comando!! \n\n *Exemplo: *${PREFIX + command
            } Evo | BOT`
          );
        b.sendWaitReply();

        try {
          m.image(
            `${BASEURL}logos/textpro/${command}/?text=${args[0]}&text2=${args[1]}`,
            `*Text Pro:* ${command}`
          );
        } catch (err) {
          b.sendReply(`Ocorreu um erro: ${err}`);
        }
      }
      break;
    ////////////////////////FIM////////////////////////
    ////////////////////TOOLS////////////////////
    case "attp":
    case "ttp":
      {
        // Verifica se foi fornecido um texto como argumento
        if (!args.length) {
          return b.sendReply(
            `Você precisa enviar um texto junto ao comando! \nEx: ${module.exports.usage}`
          );
        }
        b.sendWaitReply();

        const text = args.join(" ");

        const response = `${BASEURL}work/attp/?text=${text}`;
        const stickerLink = response;
        const outputPath = path.resolve(TEMP_DIR, "output.webp");

        // Construa o comando FFmpeg com a opção -y
        const ffmpegCommand = `ffmpeg -i "${stickerLink}" -y -vcodec libwebp -lossless 1 "${outputPath}"`;

        // Execute o comando FFmpeg e manipule o retorno quando terminar
        exec(ffmpegCommand, async (error, stdout, stderr) => {
          if (error) {
            logger.error(
              `[ ERROR ] - ffmpeg: Durante a execução ocorreu: ${error}`
            );
            return;
          }

          // Aqui, você pode enviar o arquivo WebP resultante aonde for necessário
          try {
            m.sendStickerFromFile(outputPath);
            logger.info(`[ STICKER ] - WebP: Enviada com êxito!`);
          } catch (sendError) {
            logger.error(
              `[ STICKER ] - WebP: Durante a execução ocorreu: ${sendError}`
            );
          }
        });
      }
      break;
    case "imgtolink":
      {
        if (!isImage) {
          return b.sendReply(
            `Você precisa marcar uma imagem com o comando ${PREFIX}imgtolink`
          );
        }
        b.sendWaitReply();

        try {
          const inputPath = await downloadImage(msg, "image");
          const res = await upload(inputPath);
          b.sendReply(
            `_Executado com sucesso!_\n_*Link para a imagem:*_ ${res}`
          );
        } catch (err) {
          b.sendReply(`Ocorreu um erro: ${err}`);
        }
      }
      break;
    case "owner":
      {
        b.sendTextWithMention(
          `Olá @${g.userMentioned.split("@")[0]
          }!  segue a baixo as informações relacionadas a mim e meu dono.
      
      Número:  ${CONTACT_INFO}
      Grupo: ${GROUP_LINK}
      `,
          [g.userMentioned]
        );
      }

      break;
    case "sticker":
    case "s":
    case "f":
    case "fig":
    case "figu":
      {
        if (!isImage && !isVideo) {
          return b.sendReply(
            "Você precisa marcar uma imagem/gif/video ou responder a uma imagem/gif/video"
          );
        }

        const outputPath = path.resolve(TEMP_DIR, "output.webp");
        if (isImage) {
          const inputPath = await downloadImage(msg, "input");

          exec(
            `ffmpeg -i ${inputPath}  -y  -vf scale=512:512 ${outputPath}`,
            async (error) => {
              if (error) {
                console.log(error);
                fs.unlinkSync(inputPath);
                throw new Error(error);
              }
              await m.sendStickerFromFile(outputPath);
            }
          );
        } else {
          const inputPath = await downloadVideo(msg, "input");

          const sizeInSeconds = 10;

          const seconds =
            msg.message?.videoMessage?.seconds ||
            msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
              ?.videoMessage?.seconds;

          const haveSecondsRule = seconds <= sizeInSeconds;

          if (!haveSecondsRule) {
            fs.unlinkSync(inputPath);

            await b.sendErrorReply(`O vídeo que você enviou tem mais de ${sizeInSeconds} segundos!

              Envie um vídeo menor!`);

            return;
          }

          exec(
            `ffmpeg -i ${inputPath} -y -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512,fps=12,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -f webp ${outputPath}`,
            async (error) => {
              if (error) {
                fs.unlinkSync(inputPath);

                throw new Error(error);
              }

              await m.sendStickerFromFile(outputPath);

              fs.unlinkSync(inputPath);
              fs.unlinkSync(outputPath);
            }
          );
        }
      }
      break;
    case "styletext":
      {
        if (!args.join(" ")) {
          return b.sendReply(
            `Você precisa enviar um parâmetro de busca! \nEx: ${PREFIX}styletext ${BOT_NAME}`
          );
        }
        b.sendWaitReply();

        try {
          const response = await axios.get(
            `${BASEURL}work/styletext/?text=${args.join(" ")}`
          );
          const style = response.data;
          const text = style.results.map((result) => {
            return `_Fonte: *${result.nome}*_\n_Texto: *${result.fonte}*_`;
          });

          if (text.length === 0) {
            return b.sendReply(
              "Nenhum resultado encontrado para o texto fornecido."
            );
          }

          b.sendReply(
            `_Olá ${pushname}_ 👋🏼\n_Ao estilizar o texto "${args.join(
              " "
            )}", você obteve um total de *${text.length
            } resultados.*_\n\n${text.join(`${"\u200B".repeat(4000)} \n`)}`
          );
        } catch (err) {
          b.sendReply(`Ocorreu um erro ao estilizar o texto. Erro: ${err}`);
        }
      }
      break;
    case "toimg":
      {
        if (!isSticker) {
          return b.sendReply("Você precisa enviar um sticker!");
        }
        b.sendWaitReply();

        const inputPath = await downloadSticker(msg, "input");
        const outputPath = path.resolve(TEMP_DIR, "output.png");

        exec(`ffmpeg -i ${inputPath} ${outputPath}`, async (error) => {
          fs.unlinkSync(inputPath); // Remover o arquivo de entrada independente do resultado
          if (error) {
            console.log(error);
            throw new Error(
              "Ocorreu um erro ao converter a figurinha em imagem."
            );
          }

          try {
            await m.image(outputPath);
            fs.unlinkSync(outputPath);
          } catch (err) {
            logger.error(
              "[ ERROR ] - Ocorreu um erro ao exibir a imagem convertida."
            );
          }
        });
      }
      break;
    case "traduzir":
      {
        if (!args.join(" ")) {
          return b.sendReply(
            `Você precisa enviar uma frase!\nEx: ${PREFIX}traduzir Hi! How are you?`
          );
        }
        b.sendWaitReply();

        const frase = args.join(" ");
        const idioma = "pt"; // Idioma padrão é Português (pt)

        try {
          const response = await axios.get(
            `${BASEURL}work/tradutor/?text=${encodeURIComponent(
              frase
            )}&idioma=${idioma}`
          );

          const traducao = response.data.texto;
          b.sendReply(
            `_Opa ${pushname}👋🏼_\n_O texto *${args.join(
              " "
            )}* foi traduzido com sucesso!_\n🌐*_Tradução:_* ${traducao}`
          );
        } catch (error) {
          throw new DangerError(
            `Ocorreu um erro na tradução: ${error.message}`
          );
        }
      }
      break;
    /////////////////////////FIM////////////////////

    ///////////////////WALLPAPER/////////////
    case "cyber":
    case "gamewallpaper":
    case "aesthetic":
    case "satanic":
      {
        b.sendWaitReply();

        try {
          m.image(
            `${BASEURL}wallpaper/${command}`,
            `Aqui está o seu wallpaper, ${pushname}!`
          );
        } catch (err) {
          b.sendReply(`Ocorreu um erro: ${err}`);
        }
      }
      break;

    /////////////////////////FIM////////////////////

    ///////////////////////GAMES/////////////////

    case "ppt":
      {
        if (!args[0]) {
          return b.sendReply(
            `Você precisa enviar uma jogada!\nEx: ${PREFIX}ppt pedra/papel/tesoura`
          );
        }
        const choices = ["pedra", "papel", "tesoura"];
        const userChoice = args[0].toLowerCase();
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        const getMessage = (winner, userChoice, botChoice) => {
          return `${pushname}: *${userChoice}*\n${BOT_NAME}: *${botChoice}*\n${winner}`;
        };

        if (!choices.includes(userChoice)) {
          return b.sendReply("Escolha: pedra, papel ou tesoura");
        }

        if (userChoice === botChoice) {
          const result = getMessage("Empate 🤨", userChoice, botChoice);
          b.sendReply(result);
        } else if (
          (userChoice === "pedra" && botChoice === "tesoura") ||
          (userChoice === "papel" && botChoice === "pedra") ||
          (userChoice === "tesoura" && botChoice === "papel")
        ) {
          const result = getMessage("Você ganhou 😔", userChoice, botChoice);
          b.sendReply(result);
        } else {
          const result = getMessage("Você perdeu 🙂", userChoice, botChoice);
          b.sendReply(result);
        }
      }
      break;
    case "caracoroa":
      {
        if (!args[0]) {
          return b.sendReply(
            `Você precisa enviar uma jogada!\nEx: ${PREFIX}caracoroa cara/coroa`
          );
        }
        if (args.length < 1)
          return b.sendReply("exemplo:\n*caracoroa cara\n*caracoroa coroa");

        b.sendWaitReply();
        cararo = ["cara", "coroa"];
        fej = cararo[Math.floor(Math.random() * cararo.length)];
        gg = fej;

        if (
          (fej == "cara" && args == "cara") ||
          (fej == "coroa" && args == "coroa")
        ) {
          var vit = "vitoria";
        } else if (
          (fej == "coroa" && args == "cara") ||
          (fej == "cara" && args == "coroa")
        ) {
          var vit = "derrota";
        }
        if (vit == "vitoria") {
          var tes = "Vitória do jogador";
        }
        if (vit == "derrota") {
          var tes = `A vitória é do  ${BOT_NAME}😎`;
        }

        const outputPath = path.resolve(TEMP_DIR, "output.webp");

        let link = `https://media.tenor.com/iaMrUbBGbyIAAAAM/fred-flintstone-barney-rubble.gif`;
        exec(
          `ffmpeg -i ${link} -y -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512,fps=12,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -f webp ${outputPath}`,
          async () => {
            await b.sendReply(
              `Escolha do jogador:   ${args}\nResultado:  ${fej}\n\n${tes}`
            );

            await m.sendStickerFromFile(outputPath);

            fs.unlinkSync(outputPath);
          }
        );
      }

      break;
    case "slot":
      {
        const resultado = frutas[Math.floor(Math.random() * frutas.length)];
        ppg = Math.floor(Math.random() * 13) + 349;
        if (
          resultado == "🥑 : 🥑 : 🥑" ||
          resultado == "🍉 : 🍉 : 🍉" ||
          resultado == "🍓 : 🍓 : 🍓" ||
          resultado == "🍎 : 🍎 : 🍎" ||
          resultado == "🍍 : 🍍 : 🍍" ||
          resultado == "🥝 : 🥝 : 🥝" ||
          resultado == "🍑 : 🍑 : 🍑" ||
          resultado == "🥥 : 🥥 : 🥥" ||
          resultado == "🍋 : 🍋 : 🍋" ||
          resultado == "🍐 : 🍐 : 🍐" ||
          resultado == "🍌 : 🍌 : 🍌" ||
          resultado == "🍒 : 🍒 : 🍒" ||
          resultado == "🔔 : 🔔 : 🔔" ||
          resultado == "🍊 : 🍊 : 🍊" ||
          resultado == "🍇 : 🍇 : 🍇"
        ) {
          var vitr = "Você ganhou!!!";
        } else {
          var vitr = "Você perdeu...";
        }
        try {
          b.sendReply(`Consiga 3 iguais para ganhar

╔════ ≪ •❈• ≫ ════╗
║  [💰SLOT💰 | 777 ]        
║                                             
║                                             
║      ${resultado}      ◄━┛
║           
║                                           
║  [💰SLOT💰 | 777 ]        
╚════ ≪ •❈• ≫ ════╝

          ${vitr}`);
          if (vitr == "Você ganhou!!!") {
            setTimeout(() => {
              b.sendReply(`Você ganhou!!!`);
            }, 1100);
          }
        } catch (e) {
          console.log(e);
        }
      }
      break;

    case "não":
      {
        b.sendReply("ok 🥹");
      }
      break;
    case "conselho":
      {
        axios.get(`${BASEURL}fun/conselhos`).then((res) => {
          b.sendTextWithMention(
            `*Ok @${g.participant.split("@")[0]}! Seu conselho:*☘️\n${res.data
            }`,
            [g.participant]
          );
        });
      }
      S;
      break;
    default:
      if (command) {
        b.sendReply(
          `_Opa ${pushname} 👋🏼_\n_Infelimente o comando *${command} nao foi encontrado...*_\n_Verifique a ortografia ou meu menu de comandos._`
        );
        logger.warn(
          `[ C: ${command} ] - De ${pushname} nao esta registrado...`
        );
      }
      break;
  }
};
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  logger.warn(`[ SIS ] - A: Arquivo ${__filename} foi modificado`);
  delete require.cache[file];
  require(file);
});
