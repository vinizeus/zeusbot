
const { PREFIX, GROUP_LINK, BOT_NAME, BOT_AUTHOR, CONTACT_INFO, BOT_GROUPS, BOT_VERSION } = require("../config");
exports.waitMessage = `Seu comando está sendo processado...`;

const date = new Date();
exports.guia = `
**Guia de Uso do ${BOT_NAME} no WhatsApp:**

**1. Menus Disponíveis:**
   - Para visualizar as opções disponíveis, digite ${PREFIX}menu.
   - Ao selecionar qualquer comando de menu, um novo menu será enviado com os comandos específicos. Basta escrever o comando listado no menu. Se não souber como usar, escreva o comando e, se necessário, adicione os parâmetros.

**2. Funcionalidades Principais:**
   - Utilize os comandos abaixo para explorar diferentes funcionalidades. Lembre-se de adicionar o prefixo antes de cada comando.
    
      - 🎉 Brincadeiras: ${PREFIX}brincadeiras
      - 🎨 Logos: ${PREFIX}logos
      - 🌈 Efeitos: ${PREFIX}efeitos
      - 🤖 IA: ${PREFIX}ia
      - ⚙️ Administração: ${PREFIX}adminstracao
      - 🔍 Pesquisas: ${PREFIX}pesquisas
      - 🛠️ Ferramentas: ${PREFIX}ferramentas
      - 👨‍💼 Dono: ${PREFIX}dono
      - 🔞 +18: ${PREFIX}+18

**3. Funcionalidades para Administradores:**
   - Administradores têm acesso a recursos de moderação para manter o grupo seguro e organizado.
      - 🚫 **AntiLink:** ${PREFIX}antilink - Apaga links indesejados.
      - 🚷 **AntiLinkHard:** ${PREFIX}antilinkhard - Bane e apaga links automaticamente.
      - 🌐 **AntiFake:** ${PREFIX}antifake - Bane números internacionais.
      - 🤖 **Modo Simi:** ${PREFIX}simi on/off - Ativa/Desativa o modo simi para respostas automáticas.

**4. Comandos Adicionais:**
   - 🎵 **Tocar Música:** ${PREFIX}play [nome da música] - Inicie uma música.
   - 🖼️ **Criar Figurinha:** Envie uma imagem com a legenda ${PREFIX}s para criar uma figurinha.
   - 🤣 **Meme Aleatório:** ${PREFIX}meme - Receba um meme aleatório.
   - 📽️ **Baixar Vídeo do Instagram:** ${PREFIX}instagram [link] - Baixe vídeos do Instagram.
   - 🐾 **Pet Figurinha:** ${PREFIX}pet - Crie uma figurinha fofa com uma foto.

**5. Atualizações e Suporte:**
   - 🔄 **Atualizações:** ${PREFIX}atualizacoes - Verifique as últimas atualizações do ${BOT_NAME}.
   - 🆘 **Suporte:** ${PREFIX}suporte - Obtenha ajuda ou reporte problemas ao suporte.

Aproveite todas as funcionalidades do ${BOT_NAME} e mantenha seu grupo animado e protegido! 🎉🤖`

const initMneu = `
`;

exports.menuMessage = () => {
  return `${initMneu}
                       「 𝑍𝑒𝑢𝑠 ⚡ 」  
╔────────
║〆  Versão : ${BOT_VERSION || "2.0"}
║〆  _Link do gp: ${PREFIX}botgp_
║〆  _Contato: ${PREFIX}criador_
╚─────────────────⊀

╔────────
║〆 _${PREFIX}brincadeiras_
║〆 _${PREFIX}logos_
║〆 _${PREFIX}efeitos_
║〆 _${PREFIX}memes_
║〆 _${PREFIX}ia_
║〆 _${PREFIX}download_
║〆 _${PREFIX}menuadm
║〆 _${PREFIX}pesquisas_
║〆 _${PREFIX}ferramentas_
║〆 _${PREFIX}dono_
║〆 _${PREFIX}wallpaper_
║〆 _${PREFIX}+18_
╚─────────────────⊀
`}
exports.funMenu = () => {
  return `${initMneu}
                         「 𝐷𝑖𝑣𝑒𝑟𝑠𝑜𝑒𝑠 」
╔────────
║〆 _${PREFIX}jogos_
║〆 _${PREFIX}gay_
║〆 _${PREFIX}gostosa_
║〆 _${PREFIX}beleza_
║〆 _${PREFIX}morte_
║〆 _${PREFIX}pau_
║〆 _${PREFIX}gadometro_
║〆 _${PREFIX}par_
║〆 _${PREFIX}casal_
║〆 _${PREFIX}pergunta_
║〆 _${PREFIX}chance_
║〆 _${PREFIX}correio_
║〆 _${PREFIX}insulto_
║〆 _${PREFIX}fatoinutil_
║〆 _${PREFIX}historia_
║〆 _${PREFIX}meme_
║〆 _${PREFIX}piada_
║〆 _${PREFIX}abraco_
║〆 _${PREFIX}chute_
║〆 _${PREFIX}tapa_
║〆 _${PREFIX}beijo_
║〆 _${PREFIX}carinho_
╚─────────────────⊀`;
};

exports.papelparede = () => {
  return `${initMneu}
                                           「 𝑊𝑎𝑙𝑙𝑝𝑎𝑝𝑒𝑟 」
╔────────
║〆 _${PREFIX}satanic_
║〆 _${PREFIX}carro_
║〆 _${PREFIX}asthetic_
║〆 _${PREFIX}cyber_
║〆 _${PREFIX}gamewallpaper_
║〆 _${PREFIX}searchwallpaper_
║〆 _${PREFIX}metadinha_
╚─────────────────⊀
`}
exports.gameMenu = () => {
  return `${initMneu}
                                           「 𝐺𝑎𝑚𝑒𝑠 」
╔────────
║〆 _${PREFIX}ppt_
║〆 _${PREFIX}slot_
║〆 _${PREFIX}caracoroa_
║〆 _${PREFIX}fortniteshop_ 
║〆 _${PREFIX}gamewallpaper_
╚─────────────────⊀`;
};

exports.dlMenu = () => {
  return `${initMneu}\n

                                         「 𝐷𝑙 𝑀𝑒𝑛𝑢 」
╔────────
║〆 _${PREFIX}play_
║〆 _${PREFIX}playmp4_
║〆 _${PREFIX}ytmp3_
║〆 _${PREFIX}ytmp4_
║〆 _${PREFIX}tiktok_
║〆 _${PREFIX}tiktokaudio_
║〆 _${PREFIX}instagram_
║〆 _${PREFIX}spotifydl_
║〆 _${PREFIX}facebook_
║〆 _${PREFIX}amv_
╚─────────────────⊀`;
};

exports.ownerMenu = () => {
  return `${initMneu}\n

                                         「 𝑂𝑤𝑛𝑒𝑟 」
╔────────
║〆 _${PREFIX}addprem_
║〆 _${PREFIX}join_
║〆 _${PREFIX}ban_
║〆 _${PREFIX}unban_
║〆 _${PREFIX}addprem_
║〆 _${PREFIX}delprem_
║〆 _${PREFIX}bangp_
║〆 _${PREFIX}unbangp_
║〆 _${PREFIX}block_
║〆 _${PREFIX}unblock_
║〆 _${PREFIX}idgp_
╚─────────────────⊀
`;
};
exports.soundmenu = () => {
  return `${initMneu}
                                         「 𝐴𝑢𝑑𝑖𝑜 𝐸𝑓𝑓𝑒𝑐𝑡𝑠 」
╔────────
║〆 _${PREFIX}equalizer_
║〆 _${PREFIX}volume_
║〆 _${PREFIX}acrusher_
║〆 _${PREFIX}slow_
║〆 _${PREFIX}asetrate_
║〆 _${PREFIX}areverse_
║〆 _${PREFIX}afftfilt_
║〆 _${PREFIX}chorus_
║〆 _${PREFIX}bass_
║〆 _${PREFIX}bandreject_
║〆 _${PREFIX}robot_
║〆 _${PREFIX}fast_
╚─────────────────⊀
`;
};

exports.efeitosMenu = () => {
  return `${initMneu}
                                       「 𝐸𝑓𝑒𝑖𝑡𝑜𝑠 」
╔────────
║〆 _${PREFIX}tocartoon_
║〆 _${PREFIX}toanime_
║〆 _${PREFIX}tocartoon_
║〆 _${PREFIX}gayf_
║〆 _${PREFIX}blur_
║〆 _${PREFIX}invert_
║〆 _${PREFIX}sepia_
║〆 _${PREFIX}confusedstonk_
║〆 _${PREFIX}delete_
║〆 _${PREFIX}jail_
║〆 _${PREFIX}rip_
║〆 _${PREFIX}stonk_
║〆 _${PREFIX}trash_
║〆 _${PREFIX}circle_
║〆 _${PREFIX}batslap_
║〆 _${PREFIX}doublestonk_
║〆 _${PREFIX}triggered_
║〆 _${PREFIX}sketch_
║〆 _${PREFIX}drip_
║〆 _${PREFIX}toanime2_
║〆 _${PREFIX}efeitos2_
║〆 _${PREFIX}efeitosaudio_
╚─────────────────⊀
`;
};
exports.efeitos2Menu = () => {
  return `${initMneu}   
                                     「 𝐸𝑓𝑒𝑖𝑡𝑜𝑠 2 」
╔────────
║〆 _${PREFIX}ad_
║〆 _${PREFIX}affect_
║〆 _${PREFIX}beautiful_
║〆 _${PREFIX}bobross_
║〆 _${PREFIX}discordblack_
║〆 _${PREFIX}discordblue_
║〆 _${PREFIX}facepalm_
║〆 _${PREFIX}hitler_
║〆 _${PREFIX}karaba_
║〆 _${PREFIX}mms_
║〆 _${PREFIX}notstonk_
║〆 _${PREFIX}poutine_
║〆 _${PREFIX}tatoo_
║〆 _${PREFIX}thomas_
║〆 _${PREFIX}doublestonk_
╚─────────────────⊀
`;
};

exports.searchMenu = () => {
  return `${initMneu}
                                     「 𝑃𝑒𝑠𝑞𝑢𝑖𝑠𝑎𝑠 」
╔────────
║〆 _${PREFIX}anime_
║〆 _${PREFIX}animebyframe_
║〆 _${PREFIX}searchwallpaper_
║〆 _${PREFIX}yts_
║〆 _${PREFIX}google_
║〆 _${PREFIX}epicgames_
║〆 _${PREFIX}dolar_
║〆 _${PREFIX}euro_
║〆 _${PREFIX}libra_
║〆 _${PREFIX}bitcoin_
║〆 _${PREFIX}ethereum_
║〆 _${PREFIX}github_
║〆 _${PREFIX}pinterest_
╚─────────────────⊀
`;
};


exports.logos2Menu = () => {
  return `${initMneu} 
                                     「 𝑀𝑒𝑛𝑢 𝑙𝑜𝑔𝑜𝑠 2」
╔────────
║〆 _${PREFIX}coffee_ 
║〆 _${PREFIX}moon_ 
║〆 _${PREFIX}fire_
║〆 _${PREFIX}grafite_
║〆 _${PREFIX}minions_
║〆 _${PREFIX}greenneon_
║〆 _${PREFIX}glow_
║〆 _${PREFIX}blackpink_
║〆 _${PREFIX}1917_
║〆 _${PREFIX}lol_
║〆 _${PREFIX}messi_
║〆 _${PREFIX}neymar_
║〆 _${PREFIX}chelsea_
║〆 _${PREFIX}scholes_
║〆 _${PREFIX}sgoogle_
║〆 _${PREFIX}neymar_
║〆 _${PREFIX}holograpic_
╚─────────────────⊀
`;
};
exports.logosMenu = () => {
  return `${initMneu}
                                   「 𝑀𝑒𝑛𝑢 𝑙𝑜𝑔𝑜𝑠 」
╔────────
║〆 _${PREFIX}yasuologo_
║〆 _${PREFIX}joker_
║〆 _${PREFIX}amongus_
║〆 _${PREFIX}pubgvideo_
║〆 _${PREFIX}dragonball_ 
║〆 _${PREFIX}lolaviso_
║〆 _${PREFIX}amongbanner_
║〆 _${PREFIX}devil_
║〆 _${PREFIX}pubglogo_
║〆 _${PREFIX}pubgbanner_
║〆  _${PREFIX}yasuologo_
║〆 _${PREFIX}naruto_
║〆 _${PREFIX}wolf_
║〆 _${PREFIX}wolf2_
║〆 _${PREFIX}vingadores_
║〆 _${PREFIX}marvel_
║〆 _${PREFIX}thor_
║〆 _${PREFIX}capitaoamerica_
║〆 _${PREFIX}pornhub_
║〆 _${PREFIX}space_
║〆 _${PREFIX}batman_
║〆 _${PREFIX}bf4_
║〆 _${PREFIX}logos2_
╚─────────────────⊀
`;
};
exports.iaMenu = () => {
  return `${initMneu}\n

                                 「 𝑀𝑒𝑛𝑢 𝐼𝐴 」
╔────────
║〆 _${PREFIX}gemini_
║〆 _${PREFIX}bing_
║〆 _${PREFIX}mixtral_
║〆 _${PREFIX}gpt_
║〆 _${PREFIX}removebg_
║〆 _${PREFIX}remini_
║〆 _${PREFIX}resumir_
║〆 _${PREFIX}gerarimagens_
║〆 _${PREFIX}evo_
║〆 _${PREFIX}imggenerator_
║〆 _${PREFIX}simi_
║〆 _${PREFIX}bard_
║〆 _${PREFIX}modosimi_
║〆 _${PREFIX}fakeface_
╚─────────────────⊀`;
};
exports.modelosMenu = () => {
  return `${initMneu} \n

                               「 𝑀𝑜𝑑𝑒𝑙𝑜𝑠 𝑑𝑒 𝐺𝑒𝑟𝑎ç𝑎𝑜 」
╔────────
║〆 _${PREFIX}revanimated
║〆 _${PREFIX}cyberrealistic
║〆 _${PREFIX}cuteyukimi
║〆 _${PREFIX}toonanime
║〆 _${PREFIX}semireal
║〆 _${PREFIX}childrensstories
║〆 _${PREFIX}orangemix
║〆 _${PREFIX}anything
║〆 _${PREFIX}analogdiffusion
║〆 _${PREFIX}amireal
║〆 _${PREFIX}toonyou
║〆 _${PREFIX}redsshift
║〆 _${PREFIX}realisticvision
║〆 _${PREFIX}openjourney
║〆 _${PREFIX}lofi
║〆 _${PREFIX}dreamlikephotoreal
║〆 _${PREFIX}eimisanimediffusion
║〆 _${PREFIX}dreamlikeanime
║〆 _${PREFIX}deliberate
╚─────────────────⊀`;
};

exports.memesMenu = () => {
  return `${initMneu}
                             「 𝑀𝑒𝑚𝑒𝑠 」
╔────────
║〆 _${PREFIX}meme_
║〆 _${PREFIX}drake_
║〆 _${PREFIX}distracted_
║〆 _${PREFIX}twobuttons_
║〆 _${PREFIX}changemymind_
║〆 _${PREFIX}slap_
║〆 _${PREFIX}left_
║〆 _${PREFIX}bobesponja_
║〆 _${PREFIX}skeleton_
║〆 _${PREFIX}buzz_
║〆 _${PREFIX}dodge_
║〆 _${PREFIX}disaster_
║〆 _${PREFIX}rollsafe_
║〆 _${PREFIX}futurama_
║〆 _${PREFIX}memes2
║〆 _${PREFIX}memes3
║〆 _${PREFIX}memes4
╚─────────────────⊀
┃
`;
};

exports.memes2Menu = () => {
  return `${initMneu} 
                             「 𝑀𝑒𝑚𝑒𝑠 」
╔────────
║〆 _${PREFIX}blankbutton_
║〆 _${PREFIX}poo_
║〆 _${PREFIX}mostinteresting_
║〆 _${PREFIX}therock_
║〆 _${PREFIX}pigeon_
║〆 _${PREFIX}handshake_
║〆 _${PREFIX}wonka_
║〆 _${PREFIX}grumpycat_
║〆 _${PREFIX}yuno_
║〆 _${PREFIX}kermit_
║〆 _${PREFIX}otherwoman_
║〆 _${PREFIX}kermitdrink_
╚─────────────────⊀
`;
}
exports.memes4Menu = () => {
  return `${initMneu} 
                             「 𝑀𝑒𝑚𝑒𝑠 」
╔────────
║〆 _${PREFIX}barnie_
║〆 _${PREFIX}pikachu_
║〆 _${PREFIX}dicaprio_
║〆 _${PREFIX}mostinteresting_
║〆 _${PREFIX}15years_
║〆 _${PREFIX}doge_
║〆 _${PREFIX}puppet_
║〆 _${PREFIX}escobar_
║〆 _${PREFIX}finding_
║〆 _${PREFIX}tom_
║〆 _${PREFIX}samepicture_
║〆 _${PREFIX}yoda_
║〆 _${PREFIX}hannibal_
║〆 _${PREFIX}mytrophy_
║〆 _${PREFIX}headout_
║〆 _${PREFIX}fine_
║〆 _${PREFIX}facepalm_
║〆 _${PREFIX}matrix_
║〆 _${PREFIX}smallowpills_
║〆 _${PREFIX}laughingleo_
║〆 _${PREFIX}patrik_
║〆 _${PREFIX}belikebill_
║〆 _${PREFIX}gameofthrones_
║〆 _${PREFIX}uno_
║〆 _${PREFIX}running_
║〆 _${PREFIX}notsimply_
║〆 _${PREFIX}ancient_
╚─────────────────⊀
`}
exports.memes3Menu = () => {
  return `${initMneu} 
                           「 𝑀𝑒𝑚𝑒𝑠 」
╔────────
║〆 _${PREFIX}picardwtf_
║〆 _${PREFIX}realshit_
║〆 _${PREFIX}meninsuits_
║〆 _${PREFIX}gun_
║〆 _${PREFIX}waither_
║〆 _${PREFIX}jokedog_
║〆 _${PREFIX}happybobesponja_
║〆 _${PREFIX}sparrow_
║〆 _${PREFIX}sparta_
║〆 _${PREFIX}cat_
╚─────────────────⊀
`;
};


exports.premiumMenu = () => {
  return `${initMneu}
                           「 𝑀𝑒𝑛𝑢 𝑝𝑟𝑒𝑚𝑖𝑢𝑚 」
╔────────
║〆 _${PREFIX}cpf1_
║〆 _${PREFIX}cpf2_
║〆 _${PREFIX}cpf3_
║〆 _${PREFIX}tel_
║〆 _${PREFIX}cns_
║〆 _${PREFIX}cep_
║〆 _${PREFIX}placa_
║〆 _${PREFIX}cnpj_
║〆 _${PREFIX}nome_
╚─────────────────⊀
`;
};

exports.adminMenu = () => {
  return `${initMneu}
                           「 𝑀𝑒𝑛𝑢 𝑎𝑑𝑚 」
╔────────
║〆 _${PREFIX}delete_
║〆 _${PREFIX}kick_
║〆 _${PREFIX}promote_
║〆 _${PREFIX}demote_
║〆 _${PREFIX}open_
║〆 _${PREFIX}close_
║〆 _${PREFIX}name_
║〆 _${PREFIX}desc_
║〆 _${PREFIX}marcartodos_
║〆 _${PREFIX}hidetag_
║〆 _${PREFIX}exit_
║〆 _${PREFIX}antilink_
║〆 _${PREFIX}antifake_
║〆 _${PREFIX}modoadm_
║〆 _${PREFIX}welcomecard_
║〆 _${PREFIX}welcomeimg_
║〆 _${PREFIX}welcometext_
║〆 _${PREFIX}sorteio_
║〆 _${PREFIX}autotext_
║〆 _${PREFIX}autosticker_
╚─────────────────⊀
`;
};


exports.futMenu = () => {
  return `${initMneu}
                           「 𝐹𝑢𝑡𝑒𝑏𝑜𝑙 」
╔────────
║〆 _${PREFIX}estadio_
║〆 _${PREFIX}rankingfifa_
║〆 _${PREFIX}partidas_
║〆 _${PREFIX}aovivo_
║〆 _${PREFIX}rankinguefa_
╚─────────────────⊀
`;
};


exports.toolsMenu = () => {
  return `${initMneu}
                         「 𝐹𝑒𝑟𝑟𝑎𝑚𝑒𝑛𝑡𝑎𝑠 」
╔────────
║〆 _${PREFIX}tohd_
║〆 _${PREFIX}dehaze_
║〆 _${PREFIX}attp_
║〆 _${PREFIX}tts_
║〆 _${PREFIX}totext_
║〆 _${PREFIX}colorir_
║〆 _${PREFIX}tts2_
║〆 _${PREFIX}bin_
║〆 _${PREFIX}ocr_
║〆 _${PREFIX}traduzir_
║〆 _${PREFIX}ip_
║〆 _${PREFIX}fakedados_
║〆 _${PREFIX}sticker_
║〆 _${PREFIX}ping_
║〆 _${PREFIX}toaudio_
║〆 _${PREFIX}cep_
║〆 _${PREFIX}toimg_
║〆 _${PREFIX}sticker_
║〆 _${PREFIX}imgtolink_
║〆 _${PREFIX}imgtolink_
║〆 _${PREFIX}styletext_
║〆 _${PREFIX}sugerir_
║〆 _${PREFIX}avaliar_
║〆 _${PREFIX}report_
║〆 _${PREFIX}ibge_
║〆 _${PREFIX}vagalume_
║〆 _${PREFIX}linkgp_
╚─────────────────⊀
`;
};

exports.nsfwMenu = () => {
  return `${initMneu}
                         「 𝑁𝑓𝑠𝑤 」
╔────────
║〆 _${PREFIX}ass_
║〆 _${PREFIX}miakhalifa_
║〆 _${PREFIX}porno_
║〆 _${PREFIX}asiatica_
║〆 _${PREFIX}cosplay_
║〆 _${PREFIX}boobs_
║〆 _${PREFIX}searchpornsticker_
║〆 _${PREFIX}hentai_
╚─────────────────⊀
`;
};



