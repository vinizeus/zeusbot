const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  numeroTelefone: { type: String, required: true, unique: true },
  senha: { type: String },
  ppuser: { type: String },
  premium: { type: Boolean, default: false },
  nsfw: { type: Boolean, default: false },
  level: { type: Number, default: 1 },
  saldo: { type: Number, default: 5 },
});

const Usuario = mongoose.model("User", usuarioSchema);

module.exports = Usuario;
