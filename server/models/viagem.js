const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const confortos = ["BASICO", "LUXUOSO"];

const ViagemSchema = new Schema({
  cliente: { type: Schema.Types.ObjectId, ref: "Cliente", required: true },
  motorista: { type: Schema.Types.ObjectId, ref: "Motorista" },
  taxi: { type: Schema.Types.ObjectId, ref: "Taxi" },
  origem: { type: Schema.Types.ObjectId, ref: "Morada", required: true },
  destino: { type: Schema.Types.ObjectId, ref: "Morada", required: true },
  conforto: { type: String, enum: confortos, required: true },
  num_pessoas: { type: Number, required: true, default: 1 },
  estado: {
    type: String,
    enum: ['pendente', 'aceite', 'concluída', 'cancelada'],
    default: 'pendente'
  },
  seq: { type: Number },
  turno: { type: Schema.Types.ObjectId, ref: "Turno" }
});

// Índice parcial: apenas aplica a restrição de unicidade quando turno está definido
ViagemSchema.index(
  { turno: 1, seq: 1 },
  { unique: true, partialFilterExpression: { turno: { $exists: true } } }
);

module.exports = mongoose.model('Viagem', ViagemSchema);
