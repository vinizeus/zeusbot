const { getQuotedMessage } = require("../extras");

const {
  ERROR_EMOJI,
  WAIT_EMOJI,
  WARN_EMOJI,
  SUCESS_EMOJI,
} = require("../../config");

exports.reactWithBot = (bot, msg) => {
  const fatkuns = msg.quoted || msg;
  const quoted = getQuotedMessage(fatkuns);
  const remoteJid = msg?.key?.remoteJid;

  return {
    async sendReact(emoji) {
      await bot.sendMessage(remoteJid, {
        react: {
          text: emoji,
          key: msg.key,
        },
      });
    },
    async sendSuccessReact() {
      await this.sendReact(SUCESS_EMOJI);
    },
    async sendWaitReact() {
      await this.sendReact(WAIT_EMOJI);
    },
    async sendWarningReact() {
      await this.sendReact(WARN_EMOJI);
    },
    async sendErrorReact() {
      await this.sendReact(ERROR_EMOJI);
    },
  };
};
