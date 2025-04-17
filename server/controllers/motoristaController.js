const asyncHandler = require("express-async-handler");
const Motorista = require("../models/motorista");

exports.motorista_create = asyncHandler(async(req,res)=>{
    const {
        nome,
        genero,
        nif,
        anoNascimento,
        cartaConducao,
        rua,
        numPorta,
        codigoPostal,
        localidade 
    } = req.body

    if (!nome || !genero || !nif || !anoNascimento || !cartaConducao || !rua || !numPorta || !codigoPostal || !localidade) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    if (!['Masculino', 'Feminino'].includes(genero)) {
        return res.status(400).json({ erro: 'Género inválido.' });
    }

    if (!/^\d{9}$/.test(nif) || parseInt(nif) <= 0) {
        return res.status(400).json({ erro: 'NIF inválido.' });
    }

      const idade = new Date().getFullYear() - anoNascimento;   
    if (idade < 18) {
        return res.status(400).json({ erro: 'O motorista tem de ter pelo menos 18 anos.' });
    }

    const novaPessoa = await Pessoa.create({ nome, genero, nif });

    const novaMorada = await Morada.create({rua,numPorta,codigoPostal,localidade});

    const novoMotorista = await Motorista.create({
      pessoa: novaPessoa._id,
      morada: novaMorada._id,
      anoNascimento,
      cartaConducao
    });
    
    res.status(201).json({ mensagem: 'Motorista criado com sucesso.', motorista: novoMotorista });

});