const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MoradaSchema = new mongoose.Schema({
  rua: { type: String, required: true },
  numPorta: { type: String },
  codigoPostal: { type: String },
  localidade: { type: String, required: true }
});

module.exports = mongoose.model('Morada', MoradaSchema);
