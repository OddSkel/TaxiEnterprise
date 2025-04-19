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
    type: string,
    enum: modelos,
    required: true,
  },
  nivel_conforto: {
    type: String,
    enum: confortos,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  motoristaId: {
    type: Schema.Types.ObjectId,
    ref: "Motorista", // This is how we reference the Pet model
    default: null, // If no pet is associated, set it to null
  },
  clienteId: {
    type: Schema.Types.ObjectId,
    ref: "Cliente", // This is how we reference the Pet model
    default: null, // If no pet is associated, set it to null
  },
});

module.exports = mongoose.model("Taxi", TaxiSchema);
