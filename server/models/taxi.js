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

const modelos = ["M50", "AMG40", "R8", "PANAMERA", "COROLLA", "BLITZ", "I10"];

const TaxiSchema = new Schema(
  {
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
  },
  { timestamps: true }
);
TaxiSchema.virtual("timestamp").get(function () {
  return this.createdAt.getTime();
});

module.exports = mongoose.model("Taxi", TaxiSchema);
