const AssemblyAI = require("assemblyai");
const axios = require("axios");
const fsx = require("fs-extra");

const logger = require("../../middlewares/logger");
const { downloadAudio } = require("../downoad/downloadMedia");
const {
  HEADERS_ASSEMBLY,
  ASSEMBLY_URL,
  ASSEMBLY_IA_KEY,
} = require("../../config");

async function audioTotext(msg, lang) {
  try {
    const path = await downloadAudio(msg, "audio.mp3");
    const audioData = await fsx.readFile(path);
    const uploadResponse = await axios.post(
      `${ASSEMBLY_URL}/upload`,
      audioData,
      {
        headers: HEADERS_ASSEMBLY,
      }
    );
    logger.warn("[ CONVERT ] - Bot: Convertendo audio em texto...");
    const audio_url = uploadResponse.data.upload_url;
    const client = new AssemblyAI({
      apiKey: ASSEMBLY_IA_KEY,
    });
    const data = {
      audio_url,
      language_code: lang,
    };
    const transcript = await client.transcripts.create(data);
    logger.info("[ CONVERT ] - Bot: Audio convertido em texto com exito!");
    return transcript;
  } catch (error) {
    logger.error(
      "[ ERROR ] - convert: Ocorreu um erro ao converter o audio em texto..."
    );
  }
}

module.exports = audioTotext;
