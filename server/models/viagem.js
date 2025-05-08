const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ViagemSchema = new Schema({
  num_pessoas: {
    type: Number,
    required: true,
    default: 0,
  },
  seq: {
    type: Number,
    required: true,
  },
  turno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Turno",
    required: true,
  },
});

ViagemSchema.index({ turnoId: 1, seq: 1 }, { unique: true });

module.exports = mongoose.model("Viagem", ViagemSchema);
