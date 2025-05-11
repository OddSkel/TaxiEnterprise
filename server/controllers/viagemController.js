const Viagem = require("../models/viagem");
const Cliente = require("../models/cliente");
const Pessoa = require("../models/pessoa");
const Morada = require("../models/morada");
const Turno = require("../models/turno");
const mongoose = require("mongoose");

// Função utilitária para validações
function validatePessoa(pessoa) {
  return /^[0-9]{9}$/.test(pessoa.nif) && ["masculino", "feminino"].includes(pessoa.genero);
}

exports.pedirViagem = async (req, res) => {
  try {
    const {
      pessoa,
      origem,
      destino,
      conforto,
      numPessoas,
      coordenadasOrigem,
      coordenadasDestino
    } = req.body;

    if (!pessoa || !validatePessoa(pessoa)) {
      return res.status(400).json({ message: "Dados inválidos da pessoa." });
    }

    const novaPessoa = new Pessoa(pessoa);
    await novaPessoa.save();

    const novoCliente = new Cliente({ pessoa: novaPessoa._id });
    await novoCliente.save();

    const moradaOrigem = new Morada(origem);
    const moradaDestino = new Morada(destino);
    await moradaOrigem.save();
    await moradaDestino.save();

    const viagem = new Viagem({
      cliente: novoCliente._id,
      origem: {
        morada: moradaOrigem._id,
        coordenadas: coordenadasOrigem
      },
      destino: {
        morada: moradaDestino._id,
        coordenadas: coordenadasDestino
      },
      conforto,
      numPessoas,
      estado: "pendente",
      seq: 0, // será atualizado ao ser aceite por um motorista
      turno: null
    });

    await viagem.save();
    return res.status(201).json({ message: "Pedido de táxi efetuado com sucesso.", viagem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao criar pedido de viagem." });
  }
};

exports.listarPedidos = async (req, res) => {
  try {
    const motoristaId = req.params.motoristaId;
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Coordenadas não fornecidas." });
    }

    const turnoAtual = await Turno.findOne({
      motorista: motoristaId,
      start: { $lte: new Date() },
      end: { $gte: new Date() }
    });

    if (!turnoAtual) {
      return res.status(200).json([]); // Sem turno ativo
    }

    const viagensPendentes = await Viagem.find({
      estado: "pendente"
    })
      .populate("cliente")
      .populate({ path: "origem.morada" })
      .populate({ path: "destino.morada" });

    const pedidosComDistancia = viagensPendentes.map(viagem => {
      const dist = calcularDistancia(
        latitude,
        longitude,
        viagem.origem.coordenadas.latitude,
        viagem.origem.coordenadas.longitude
      );

      return {
        _id: viagem._id,
        numPessoas: viagem.numPessoas,
        origem: viagem.origem.morada,
        destino: viagem.destino.morada,
        distancia: dist
      };
    });

    pedidosComDistancia.sort((a, b) => a.distancia - b.distancia);
    return res.status(200).json(pedidosComDistancia);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao listar pedidos." });
  }
};

exports.aceitarPedido = async (req, res) => {
  try {
    const { viagemId, turnoId } = req.body;

    const turno = await Turno.findById(turnoId);
    if (!turno) return res.status(404).json({ message: "Turno não encontrado." });

    const countViagens = await Viagem.countDocuments({ turno: turnoId });

    const viagem = await Viagem.findById(viagemId);
    if (!viagem) return res.status(404).json({ message: "Viagem não encontrada." });

    viagem.turno = turno._id;
    viagem.taxi = turno.taxi;
    viagem.motorista = turno.motorista;
    viagem.seq = countViagens + 1;
    viagem.estado = "aguarda_confirmacao";

    await viagem.save();
    return res.status(200).json({ message: "Pedido aceite. Aguardando confirmação do cliente.", viagem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao aceitar pedido." });
  }
};

// Utilitário de distância em km
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
