const pino = require("pino");

const logger = pino({
  level: "debug",
  prettyPrint: {
    colorize: true,
    translateTime: "yyyy-mm-dd HH:MM:ss",
  },
});

module.exports = logger;
