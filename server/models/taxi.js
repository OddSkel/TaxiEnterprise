const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marcas = [
  "BMW",
  "MERCEDES",
  "AUDI",
  "PORSCHE",
  "TOYOTA",
  "OPEL",
  "HYUNDAI",
];
const confortos = ["BASICO", "LUXUOSO"];

const modelos = ["M50", "AUG40", "R8", "PANAMERA", "COROLLA", "BLITZ", "I10"];

const TaxiSchema = new Schema({
  matricula: {
    type: String,
    required: true,
  },
  ano_compra: {
    type: Number,
    required: true,
  },
  marca: {
    type: String,
    required: true,
    enum: marcas,
  },
  modelo: {
    type: String,
    enum: modelos,
    required: true,
  },
  nivel_conforto: {
    type: String,
    enum: confortos,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  motorista: {
    type: Schema.Types.ObjectId,
    ref: "Motorista", // This is how we reference the Motorista model
  },
  cliente: {
    type: Schema.Types.ObjectId,
    ref: "Cliente", // This is how we reference the Cliente model
  },
});

module.exports = mongoose.model("Taxi", TaxiSchema);
