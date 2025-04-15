const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaxiSchema = new Schema({

});

module.exports = mongoose.model("Taxi",TaxiSchema);