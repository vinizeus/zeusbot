
const audioTotext = require("./upload/uploadAudio");
const onReadyJson = require("./upload/addToJson/onOff");
const queryBy = require("./extras/consulta");
const { addFilter, isSpam } = require("./extras/antispam");
const { frutas } = require("./game/slot");
const { upload, createZipFolder } = require("./extras/util");
const {
    addPremiumUser,
    removeExpiredPremiumUsers,
} = require("../functions/upload/addToJson/premium");
const { addPremiumGroup, removeExpiredPremiumGroups } = require("./upload/addToJson/premiumgp");
const {
    baileysIs,
    getQuotedMessage,
    splitByCharacters,
} = require("./extras");

module.exports = {
    audioTotext,
    onReadyJson,
    queryBy,
    addFilter, isSpam,
    frutas,
    upload,
    createZipFolder,
    addPremiumGroup, removeExpiredPremiumGroups, addPremiumUser, getQuotedMessage, baileysIs,
    removeExpiredPremiumUsers, splitByCharacters
}