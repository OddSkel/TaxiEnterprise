const Pessoa = require("../models/pessoa");
const Morada = require("../models/morada");
const Motorista = require("../models/motorista");

function validarNIF(nif) {
  return nif.length === 9 && nif > 0;
}

function calcularIdade(anoNascimento) {
  return new Date().getFullYear() - anoNascimento;
}

function validarCodigoPostal(codigo) {
  return codigo.match(/^(\d{4})-\d{3}$/);
}

exports.createMotorista = async (req, res) => {
  try {
    console.log(req.body);

    const {
      pessoa: { nome, genero, nif },
      morada: { rua, numPorta, codigoPostal, localidade },
      anoNascimento,
      cartaConducao,
    } = req.body;

    // Validações
    if (!validarNIF(nif)) return res.status(400).json({ erro: "NIF inválido" });
    if (!["masculino", "feminino"].includes(genero))
      return res.status(400).json({ erro: "Género inválido" });
    if (calcularIdade(anoNascimento) < 18)
      return res.status(400).json({ erro: "Motorista tem menos de 18 anos" });
    if (!validarCodigoPostal(codigoPostal))
      return res.status(400).json({ erro: "Código postal inválido" });
    if (!cartaConducao)
      return res.status(400).json({ erro: "Carta de condução inválida" });

    // Criar documentos
    const pessoa = new Pessoa({
      nome,
      genero,
      nif,
    });
    await pessoa.save();

    const morada = new Morada({
      rua,
      numPorta,
      codigoPostal,
      localidade,
    });
    await morada.save();

    const motorista = new Motorista({
      pessoa: pessoa._id,
      morada: morada._id,
      anoNascimento,
      cartaConducao,
    });
    await motorista.save();

    res.status(201).json(motorista);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao registar motorista", detalhes: err.message });
  }
};

exports.getMotoristas = async (req, res) => {
  try {
    const motoristas = await Motorista.find()
      .populate("pessoa")
      .populate("morada")
      .sort({ createdAt: -1 })
      .exec();
    res.json(motoristas);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao listar motoristas", detalhes: err.message });
  }
};

exports.getMotoristaById = async (req, res) => {
  try {
    const motoristaId = req.params.id;
    const motorista = await Motorista.findById(motoristaId)
      .populate("pessoa")
      .populate("morada")
      .exec();
    if (!motorista)
      return res.status(404).json({ erro: "Motorista nao encontrado" });
    res.json(motorista);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao obter motorista", detalhes: err.message });
  }
};

exports.deleteMotorista = async (req, res) => {
  try {
    const motoristaId = req.params.id;

    const motorista = await Motorista.findById(motoristaId).exec();
    if (!motorista) {
      return res.status(404).json({ erro: "Motorista não encontrado" });
    }

    const pessoaId = motorista.pessoa;
    const moradaId = motorista.morada;

    await Motorista.findByIdAndDelete(motoristaId).exec();
    await Pessoa.findByIdAndDelete(pessoaId).exec();
    await Morada.findByIdAndDelete(moradaId).exec();

    res.json({ message: "Motorista, pessoa e morada removidos com sucesso" });
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao remover motorista", detalhes: err.message });
  }
};

exports.updateMotorista = async (req, res) => {
  try {
    const motoristaId = req.params.id;
    const { nome, genero, nif, anoNascimento, cartaConducao } = req.body;
    const motorista = await Motorista.findById(motoristaId).exec();
    if (!motorista)
      return res.status(404).json({ erro: "Motorista nao encontrado" });
    motorista.pessoa.nome = nome;
    motorista.pessoa.genero = genero;
    motorista.pessoa.nif = nif;
    motorista.anoNascimento = anoNascimento;
    motorista.cartaConducao = cartaConducao;
    await motorista.save();
    res.json(motorista);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao atualizar motorista", detalhes: err.message });
  }
};

exports.getMotoristaByNIF = async (req, res) => {
  try {
    const nif = req.params.nif;
    const pessoa = await Pessoa.findOne({ nif: nif });
    if (!pessoa) {
      return res
        .status(404)
        .json({ erro: "Pessoa com esse NIF não encontrada" });
    }

    // Then, find the Motorista that references this Pessoa
    const motorista = await Motorista.findOne({ pessoa: pessoa._id })
      .populate("pessoa")
      .populate("morada")
      .exec();

    if (!motorista) {
      return res.status(404).json({ erro: "Motorista não encontrado" });
    }

    res.json(motorista);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao obter motorista", detalhes: err.message });
  }
};

exports.getNIFS = async (req, res) => {
  const nif = req.query.nif;

  if (!nif) {
    return res.status(400).json({ error: "NIF é obrigatório." });
  }

  try {
    const motoristas = await Motorista.find()
      .populate({
        path: "pessoa",
        match: { nif: { $regex: "^" + nif } },
        select: "nif nome",
      })
      .exec();

    const filtered = motoristas.filter((m) => m.pessoa); // only motoristas with matching pessoa
    if (filtered.length === 0) {
      return res.status(400).json({ error: "Motorista não encontrado!" });
    }

    res.json(filtered);
  } catch (err) {
    console.error("Erro ao procurar motoristas por NIF:", err);
    res.status(500).json({ error: "Erro ao procurar motoristas" });
  }
};
