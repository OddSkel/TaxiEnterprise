const mongoose = require('mongoose');
const Schema = mongoose.Schema

const MoradaSchema = new mongoose.Schema({
  rua: { type: String, required: true },
  numPorta: { type: String, required: true },
  codigoPostal: { type: String, required: true },
  localidade: { type: String }
});

module.exports = mongoose.model('Morada', MoradaSchema);
