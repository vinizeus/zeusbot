const { jidDecode } = require("@whiskeysockets/baileys");
const { store } = require("../conect/connect");
const decodeJid = (jid) => {
  if (!jid) return jid;
  if (/:\d+@/gi.test(jid)) {
    let decode = jidDecode(jid) || {};
    return (
      (decode.user && decode.server && decode.user + "@" + decode.server) || jid
    );
  } else return jid;
};

exports.updateContacts = (bot) => {
  bot.ev.on("contacts.update", (update) => {
    for (let contact of update) {
      let id = decodeJid(contact.id);
      if (store && store.contacts)
        store.contacts[id] = { id, name: contact.notify };
    }
  });
};
