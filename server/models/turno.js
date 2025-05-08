const mongoose = require("mongoose");

const turnoSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  motorista: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Motorista",
    required: true,
  },
  taxi: { type: mongoose.Schema.Types.ObjectId, ref: "Taxi", required: true },
});

module.exports = mongoose.model("Turno", turnoSchema);
