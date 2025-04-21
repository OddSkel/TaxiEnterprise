const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MotoristaSchema = new Schema({
    _id:{type:String,unique: true},
    pessoa:{type:mongoose.Schema.Types.ObjectId,ref:'Pessoa',required:true},
    morada:{type:mongoose.Schema.Types.ObjectId,ref:'Morada', required:true},
    anoNascimento:{type: Number,required: true},
    cartaConducao:{type:String,requires:true,unique:true}
}, { timestamps: true });


module.exports = mongoose.model("Motorista", MotoristaSchema);