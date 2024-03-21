const chalkAnimation = require("chalkercli");
const logger = require("../../middlewares/logger");

const consolekaraoke = (teks) => {
  const karaoke = chalkAnimation.karaoke(teks).stop();
  setTimeout(() => {
    karaoke.stop(); // Animation stops
  }, 100);

  setTimeout(() => {
    karaoke.start(); // Animation resumes
  }, 200);
};
const consoleradar = (teks) => {
  const karaoke = chalkAnimation.radar(teks).stop();
  setTimeout(() => {
    karaoke.stop(); // Animation stops
  }, 100);

  setTimeout(() => {
    karaoke.start(); // Animation resumes
  }, 200);
};
const consoleColor = (teks) => {
  const rainbow = chalkAnimation.rainbow(teks).stop();
  setTimeout(() => {
    rainbow.stop(); // Animation stops
  }, 10);

  setTimeout(() => {
    rainbow.start(); // Animation resumes
  }, 20);
};
const heloUser = () => {
  var date = new Date();
  var hr = date.getHours();
  var mnt = date.getMinutes();
  if (mnt < 10) {
    mnt = "0" + mnt;
  }
  var horario = "\n[" + hr + ":" + mnt + "]";
  if (hr <= 12 && hr > 6) {
    return consolekaraoke(horario + " Olá user!! Tenha um bom dia!!");
  } else if (hr > 12 && hr < 18) {
    return consolekaraoke(horario + " Olá user!! Tenha uma boa tarde!!");
  } else {
    return consolekaraoke(horario + " Olá user!! Tenha uma boa noite!!");
  }
};

const banner = `  

    ______                   ____    ______  ______
   /  ____/ _   __  _____   / __ )  / __  / /__  __/
  /  __/   | | / / / _   / / __  | / / / /   / /   
 / /___    | |/ / / /_/ / / /_/ / / /_/ /   / /    
/_____/    |___/ /_____/ /_____/ /_____/   /_/     
                                              
`;

function consoleWelcome() {
  setTimeout(() => {
    logger.info(banner);
  }, 300);
  // setTimeout(() => {
  //   heloUser();
  // }, 4000);

  // setTimeout(() => {
  //   consolekaraoke("ℹ  Feito por Brunoww e Causs");
  // }, 7400);

  // setTimeout(() => {
  //   consolekaraoke("⚠  Para suporte, contate os meus donos!!");
  // }, 9990);
  // setTimeout(() => {}, 13600);
}

module.exports = consoleWelcome;
