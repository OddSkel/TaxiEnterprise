const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
  pessoa: { type: Schema.Types.ObjectId, ref: "Pessoa", required: true },
});

module.exports = mongoose.model("Cliente", ClienteSchema);
