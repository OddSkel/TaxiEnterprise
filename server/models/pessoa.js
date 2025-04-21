const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pessoaSchema = new Schema({
    _id:{type:String,unique: true},
    nome:{type: String, required: true},
    genero:{type:String,require:true},
    nif:{type:String,required: true,unique:true}
});

module.exports = mongoose.model('Pessoa',pessoaSchema)