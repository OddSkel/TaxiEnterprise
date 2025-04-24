const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const Conforto = new Schema({
    name: {type: String, required: true},
    acrescimo: {type: Number, min: 0, max:100, required: true},
    preco: {type: Number, min:0, required: true},
})

Conforto.virtual("url").get(function () {
    return `/gestor/conforto/${this._id}`;
});

module.exports = mongoose.model("Conforto", Conforto);