const Viagem = require("../models/viagem");
const Cliente = require("../models/cliente");
const Morada = require("../models/morada");
const Turno = require("../models/turno");
const Motorista = require("../models/motorista");
const Pessoa = require("../models/pessoa");



exports.pedirViagem = async (req, res) => {
  try {
    const { cliente, origem, destino, conforto, num_pessoas } = req.body;

    // Validações do cliente
    if (!cliente?.nif || !cliente?.nome || !cliente?.genero) {
      return res.status(400).json({ message: "Dados do cliente incompletos." });
    }

    if (!["masculino", "feminino"].includes(cliente.genero)) {
      return res.status(400).json({ message: "Género inválido." });
    }

    if (!/^\d{9}$/.test(cliente.nif)) {
      return res.status(400).json({ message: "NIF inválido." });
    }

    // Validação de conforto e número de pessoas
    if (!["BASICO", "LUXUOSO"].includes(conforto)) {
      return res.status(400).json({ message: "Nível de conforto inválido." });
    }

    if (typeof num_pessoas !== "number" || num_pessoas < 1 || num_pessoas > 6) {
      return res.status(400).json({ message: "Número de pessoas inválido." });
    }

    // Verifica ou cria cliente
    let clienteDb = await Cliente.findOne({ nif: cliente.nif }).populate('pessoa');

    if (!clienteDb) {
      // Cria a Pessoa primeiro
      const pessoa = new Pessoa({
        nome: cliente.nome,
        nif: cliente.nif,
        genero: cliente.genero
      });

      await pessoa.save();

      // Depois cria o Cliente com referência à Pessoa
      clienteDb = new Cliente({
        pessoa: pessoa._id
      });

      await clienteDb.save();
    }

    // Validação e criação das moradas
    if (!origem.rua || !origem.localidade || !origem.coordenadas?.latitude || !origem.coordenadas?.longitude) {
      return res.status(400).json({ message: "Morada de origem incompleta." });
    }

    if (!destino.rua || !destino.localidade || !destino.coordenadas?.latitude || !destino.coordenadas?.longitude) {
      return res.status(400).json({ message: "Morada de destino incompleta." });
    }

    let origemDb = await Morada.findOne({ rua: origem.rua, numPorta: origem.numPorta, coordenadas: origem.coordenadas });
    let destinoDb = await Morada.findOne({ rua: destino.rua, numPorta: destino.numPorta, coordenadas: destino.coordenadas });

    if (!origemDb) {
      origemDb = new Morada(origem);
      await origemDb.save().catch(err => {
        return res.status(500).json({ message: "Erro ao salvar morada de origem." });
      });
    }

    if (!destinoDb) {
      destinoDb = new Morada(destino);
      await destinoDb.save().catch(err => {
        return res.status(500).json({ message: "Erro ao salvar morada de destino." });
      });
    }

    // Busca um turno ativo
    const agora = new Date();
    const turno = await Turno.findOne({ start: { $lte: agora }, end: { $gte: agora } });

    if (!turno) {
      return res.status(404).json({ message: "Nenhum turno ativo encontrado. Tente novamente mais tarde." });
    }

    // Determina seq
    const ultimo = await Viagem.find({ turno: turno._id }).sort({ seq: -1 }).limit(1);
    const seq = ultimo.length ? ultimo[0].seq + 1 : 1;

    // Cria a viagem
    const viagem = new Viagem({
      cliente: clienteDb._id,
      origem: origemDb._id,
      destino: destinoDb._id,
      conforto,
      num_pessoas,
      estado: "pendente",
      turno: turno._id,
      seq
    });

    await viagem.save().catch(err => {
      return res.status(500).json({ message: "Erro ao salvar viagem." });
    });

    res.status(201).json({ message: "Viagem criada com sucesso!", viagem });

  } catch (error) {
    console.error("Erro ao pedir viagem:", error);
    res.status(500).json({ message: "Erro interno ao criar a viagem.", erro: error.message });
  }

};

const calcularDistancia = (coordenadas1, coordenadas2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (coordenadas2.latitude - coordenadas1.latitude) * Math.PI / 180;
  const dLon = (coordenadas2.longitude - coordenadas1.longitude) * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(coordenadas1.latitude * Math.PI / 180) * Math.cos(coordenadas2.latitude * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c; // Em km
  return distancia;
};

exports.listarPedidos = async (req, res) => {
  try {
    const motoristaId = req.params.motoristaId;
    const motorista = await Motorista.findById(motoristaId);
    if (!motorista) {
      return res.status(404).json({ message: "Motorista não encontrado" });
    }

    const agora = new Date();
    const turno = await Turno.findOne({ motorista: motoristaId, start: { $lte: agora }, end: { $gte: agora } });
    if (!turno) {
      return res.status(404).json({ message: "Nenhum turno ativo encontrado para este motorista." });
    }

    // Buscar pedidos de viagem pendentes no turno atual
    const pedidosPendentes = await Viagem.find({
      estado: "pendente",
      turno: turno._id,
      origem: { $ne: null },
      destino: { $ne: null }
    }).populate('origem destino');

    // Calcular distância entre o motorista e cada pedido
    const pedidosComDistancia = pedidosPendentes.map(pedido => {
      const distancia = calcularDistancia(motorista.coordenadas, pedido.origem.coordenadas);
      return { 
        ...pedido.toObject(),
        distancia,
        num_pessoas: pedido.num_pessoas,
        origem: pedido.origem,
        destino: pedido.destino
      };
    });

    // Ordenar pedidos pela distância em ordem crescente
    pedidosComDistancia.sort((a, b) => a.distancia - b.distancia);

    res.status(200).json(pedidosComDistancia);

  } catch (error) {
    console.error("Erro ao listar pedidos de táxi:", error);
    res.status(500).json({ message: "Erro ao listar pedidos de táxi." });
  }
};

exports.aceitarPedido = async (req, res) => {
  try {
    const { pedidoId } = req.params;

    const pedido = await Viagem.findById(pedidoId);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido de táxi não encontrado." });
    }

    if (pedido.estado !== "pendente") {
      return res.status(400).json({ message: "Este pedido já foi processado." });
    }

    // Alteramos o estado para 'aceite' diretamente
    pedido.estado = "aceite";
    await pedido.save();

    res.status(200).json({ message: "Pedido de táxi aceito com sucesso!" });

  } catch (error) {
    console.error("Erro ao aceitar pedido:", error);
    res.status(500).json({ message: "Erro ao aceitar pedido de táxi." });
  }
};
