const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coordenadasSchema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false }
);

const MoradaSchema = new Schema({
  rua: { type: String },
  numPorta: { type: String },
  codigoPostal: { type: String },
  localidade: { type: String },
  coordenadas: { type: coordenadasSchema },
});

module.exports = mongoose.model("Morada", MoradaSchema);
