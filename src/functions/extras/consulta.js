const axios = require("axios");

const logger = require("../../middlewares/logger");

const { BASEURL, keypxd, response } = require("../../config");

async function queryBy(cmd, query, callback) {
  logger.info(`[ p: Consulta ] - ${cmd} (${query}}) esta sendo consultado!`);

  const consulta = await axios.get(`${BASEURL}puxar?type=${cmd}&q=${query}`, {
    headers: {
      Authorization: `Bearer ${keypxd}`,
    },
  });
  console.log(consulta);
  logger.info(`[ p: Consulta ] - Consulta efetuada com exito!`);

  if (consulta?.data?.resultado?.file === true) {
    logger.warn(
      `[ p: Consulta ] - Consulta descriptografada e enviada com exito!`
    );
    return callback(atob(consulta.data.resultado?.base64));
  }

  return consulta.data;
}

module.exports = queryBy;
