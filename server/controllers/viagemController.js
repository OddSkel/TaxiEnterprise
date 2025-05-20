const Viagem = require("../models/viagem");
const Cliente = require("../models/cliente");
const Morada = require("../models/morada");
const Turno = require("../models/turno");
const Motorista = require("../models/motorista");
const Pessoa = require("../models/pessoa");
const Conforto = require("../models/conforto");
const Taxi = require("../models/taxi");
const turno = require("../models/turno");

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

    if (!["BASICO", "LUXUOSO"].includes(conforto)) {
      return res.status(400).json({ message: "Nível de conforto inválido." });
    }

    if (typeof num_pessoas !== "number" || num_pessoas < 1 || num_pessoas > 6) {
      return res.status(400).json({ message: "Número de pessoas inválido." });
    }

    // Verifica ou cria cliente
    const pessoaExistente = await Pessoa.findOne({ nif: cliente.nif });
    let clienteDb;

    if (pessoaExistente) {
      console.log("Pessoa já existente:", pessoaExistente);
      clienteDb = await Cliente.findOne({ pessoa: pessoaExistente._id });
    }

    if (!clienteDb) {
      console.log("Criando novo cliente...");
      const novaPessoa = new Pessoa({
        nome: cliente.nome,
        nif: cliente.nif,
        genero: cliente.genero,
      });
      await novaPessoa.save();

      clienteDb = new Cliente({ pessoa: novaPessoa._id });
      await clienteDb.save();
    }

    console.log("Cliente encontrado ou criado:", clienteDb);

    // Verifica se clienteDb existe
    if (!clienteDb?._id) {
      return res
        .status(400)
        .json({ message: "Cliente não encontrado ou criado com sucesso." });
    }

    // Validação e criação das moradas
    if (
      !origem.rua ||
      !origem.localidade ||
      !origem.coordenadas?.latitude ||
      !origem.coordenadas?.longitude
    ) {
      return res.status(400).json({ message: "Morada de origem incompleta." });
    }

    if (
      !destino.rua ||
      !destino.localidade ||
      !destino.coordenadas?.latitude ||
      !destino.coordenadas?.longitude
    ) {
      return res.status(400).json({ message: "Morada de destino incompleta." });
    }

    ["origem", "destino"].forEach((campo) => {
      if (req.body[campo] && req.body[campo]._id === "") {
        delete req.body[campo]._id;
      }
    });

    // Busca ou cria a morada de origem
    let origemDb = await Morada.findOne({
      rua: origem.rua,
      numPorta: origem.numPorta,
      codigoPostal: origem.codigoPostal,
      localidade: origem.localidade,
      coordenadas: origem.coordenadas,
    });

    if (!origemDb) {
      console.log("Criando nova morada de origem:", origem);
      origemDb = new Morada(origem);
      await origemDb.save();
    }

    // Busca ou cria a morada de destino
    let destinoDb = await Morada.findOne({
      rua: destino.rua,
      numPorta: destino.numPorta,
      codigoPostal: destino.codigoPostal,
      localidade: destino.localidade,
      coordenadas: destino.coordenadas,
    });

    if (!destinoDb) {
      console.log("Criando nova morada de destino:", destino);
      destinoDb = new Morada(destino);
      await destinoDb.save();
    }

    // Verifica se as moradas foram criadas com sucesso
    if (!origemDb?._id || !destinoDb?._id) {
      return res
        .status(400)
        .json({ message: "Erro na criação das moradas: IDs inválidos." });
    }

    console.log(
      "Moradas encontradas ou criadas com sucesso:",
      origemDb,
      destinoDb
    );

    // Cria a viagem com estado pendente e sem motorista/taxi definidos
    const viagem = new Viagem({
      cliente: clienteDb._id,
      origem: origemDb._id,
      destino: destinoDb._id,
      conforto,
      num_pessoas,
      estado: "pendente",
      motorista: null,
      taxi: null,
    });

    await viagem.save();

    res.status(201).json({ message: "Viagem criada com sucesso!", viagem });
  } catch (error) {
    console.error("Erro ao pedir viagem:", error);
    res.status(500).json({
      message: "Erro interno ao criar a viagem.",
      erro: error.message,
    });
  }
};

// Função para calcular a distância usando a fórmula de Haversine
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

exports.listarPedidos = async (req, res) => {
  try {
    const { motoristaId } = req.params;
    let { lat, lon } = req.query;

    // Coordenadas padrão (Faculdade de Ciências)
    if (!lat || !lon) {
      lat = 38.756734;
      lon = -9.155412;
    } else {
      lat = parseFloat(lat);
      lon = parseFloat(lon);
    }

    const motorista = await Motorista.findById(motoristaId);
    if (!motorista) {
      return res.status(404).json({ message: "Motorista não encontrado." });
    }

    const now = new Date();

    const turnoAtivo = await Turno.findOne({
      motorista: motoristaId,
      start: { $lte: now },
      end: { $gte: now },
    });

    if (!turnoAtivo) {
      return res
        .status(400)
        .json({ message: "Motorista não tem turno ativo." });
    }

    const viagens = await Viagem.find({ estado: "pendente" })
      .populate("origem")
      .populate("destino")
      .populate("cliente");

    const viagensFiltradas = viagens
      .map((viagem) => {
        const origem = viagem.origem;
        const destino = viagem.destino;

        if (!origem?.coordenadas || !destino?.coordenadas) return null;

        const distancia = calcularDistancia(
          lat,
          lon,
          origem.coordenadas.latitude,
          origem.coordenadas.longitude
        );

        const tempoRestanteMin = (new Date(turnoAtivo.end) - now) / 60000;
        const tempoEstimado = (distancia / 40) * 60;

        if (tempoEstimado > tempoRestanteMin) return null;

        return {
          _id: viagem._id,
          cliente: viagem.cliente,
          motorista: viagem.motorista,
          taxi: viagem.taxi,
          turno: turnoAtivo,
          nr_pessoas: viagem.num_pessoas,
          origem: origem.endereco,
          coordenadas_origem: origem.coordenadas,
          destino: destino.endereco,
          coordenadas_destino: destino.coordenadas,
          distanciaKm: distancia.toFixed(2),
          estimativaMin: Math.ceil(tempoEstimado),
          estado: viagem.estado,
        };
      })
      .filter((v) => v !== null)
      .sort((a, b) => a.distanciaKm - b.distanciaKm);

    return res.status(200).json(viagensFiltradas);
  } catch (err) {
    console.error("Erro ao listar pedidos:", err);
    return res
      .status(500)
      .json({ message: "Erro interno ao listar pedidos.", erro: err.message });
  }
};

exports.aceitarPedido = async (req, res) => {
  try {
    const { motoristaId, viagemId } = req.params;

    // Verificar se o motorista existe
    const motorista = await Motorista.findById(motoristaId);
    if (!motorista) {
      return res.status(404).json({ message: "Motorista não encontrado." });
    }

    // Verificar se a viagem existe e está pendente
    const viagem = await Viagem.findById(viagemId);
    if (!viagem) {
      return res.status(404).json({ message: "Viagem não encontrada." });
    }

    if (viagem.estado !== "pendente") {
      return res.status(400).json({ message: "A viagem já foi processada." });
    }

    if (viagem.motorista) {
      return res
        .status(400)
        .json({ message: "A viagem já foi aceite por outro motorista." });
    }

    const now = new Date(Date.now() + 3600000);

    // Verificar se o motorista tem um turno ativo
    const turnoAtivo = await Turno.findOne({
      motorista: motoristaId,
      start: { $lte: now },
      end: { $gte: now },
    });

    if (!turnoAtivo) {
      return res
        .status(400)
        .json({ message: "Motorista não tem turno ativo." });
    }

    // Atribuir motorista e turno à viagem
    viagem.motorista = motoristaId;
    viagem.turno = turnoAtivo._id; // Guarda o ID do turno
    viagem.seq = await gerarSeqViagem(turnoAtivo); // Gere o seq se necessário

    // Salvar a viagem
    await viagem.save();

    return res.status(200).json({
      message: "Pedido aceite. A aguardar confirmação do cliente.",
      viagem,
    });
  } catch (err) {
    console.error("Erro ao aceitar pedido:", err);
    return res.status(500).json({
      message: "Erro interno ao aceitar pedido.",
      erro: err.message,
    });
  }
};

const gerarSeqViagem = async (turno) => {
  const lastViagem = await Viagem.findOne({ turno: turno._id }).sort({
    seq: -1,
  });
  return lastViagem ? lastViagem.seq + 1 : 1;
};

exports.clienteConfirmar = async (req, res) => {
  try {
    const { clienteId, viagemId } = req.params;

    // Verificar se a viagem existe e está pendente
    const viagem = await Viagem.findById(viagemId);
    if (!viagem) {
      return res.status(404).json({ message: "Viagem não encontrada." });
    }

    if (viagem.estado !== "pendente") {
      return res
        .status(400)
        .json({ message: "A viagem já foi confirmada ou rejeitada." });
    }

    // Verificar se o cliente está associado a esta viagem
    if (viagem.cliente.toString() !== clienteId) {
      return res
        .status(400)
        .json({ message: "Esta viagem não pertence a este cliente." });
    }

    // Alterar o estado da viagem
    viagem.estado = "aceite";
    await viagem.save();

    return res.status(200).json({
      message: "Viagem confirmada. O motorista pode prosseguir.",
      viagem,
    });
  } catch (err) {
    console.error("Erro ao confirmar pedido:", err);
    return res.status(500).json({
      message: "Erro interno ao confirmar pedido.",
      erro: err.message,
    });
  }
};

exports.clienteRejeitar = async (req, res) => {
  try {
    const { clienteId, viagemId } = req.params;

    // Verificar se a viagem existe e está pendente
    const viagem = await Viagem.findById(viagemId);
    if (!viagem) {
      return res.status(404).json({ message: "Viagem não encontrada." });
    }

    if (viagem.estado !== "pendente") {
      return res
        .status(400)
        .json({ message: "A viagem já foi confirmada ou rejeitada." });
    }

    // Verificar se o cliente está associado a esta viagem
    if (viagem.cliente.toString() !== clienteId) {
      return res
        .status(400)
        .json({ message: "Esta viagem não pertence a este cliente." });
    }

    // Rejeitar o pedido e remover o motorista da viagem
    viagem.estado = "cancelada";
    viagem.motorista = null; // Remover o motorista da viagem
    await viagem.save();

    return res.status(200).json({
      message: "Viagem rejeitada. O motorista foi removido.",
      viagem,
    });
  } catch (err) {
    console.error("Erro ao rejeitar pedido:", err);
    return res.status(500).json({
      message: "Erro interno ao rejeitar pedido.",
      erro: err.message,
    });
  }
};

exports.startViagem = async (req, res) => {
  try {
    const { id } = req.params;
    const { turnoId, clienteId, numCompanions } = req.body;

    const viagem = await Viagem.findById(id);
    if (!viagem) {
      return res.status(404).json({ message: "Viagem não encontrada." });
    }

    const turno = await Turno.findById(turnoId);
    console.log("Turno:", turno);
    const cliente = await Cliente.findById(clienteId);
    console.log("Cliente:", cliente);

    if (!turno || !cliente) {
      return res
        .status(400)
        .json({ message: "Turno, táxi ou motorista inválido." });
    }

    if (numCompanions > 7 || numCompanions < 1) {
      return res.status(400).json({
        message: `Número de passageiros incorreto.`,
      });
    }

    viagem.turno = turno._id;
    viagem.cliente = cliente._id;
    let now = new Date();
    now.setHours(now.getHours() + 1);
    viagem.inicio = now;
    viagem.num_pessoas = numCompanions;
    viagem.estado = "aceite";
    viagem.fim = null;
    viagem.motorista = turno.motorista;
    viagem.taxi = turno.taxi;

    const lastViagem = await Viagem.find({ turno: turno._id })
      .sort({ seq: -1 })
      .limit(1);

    viagem.seq = lastViagem.length > 0 ? lastViagem[0].seq + 1 : 1;

    await viagem.save();

    res.status(200).json(viagem);
  } catch (error) {
    console.error("Erro ao iniciar a viagem:", error);
    res.status(500).json({ message: "Erro interno ao iniciar a viagem." });
  }
};

exports.endViagem = async (req, res) => {
  try {
    const { id } = req.params;

    const viagem = await Viagem.findById(id)
      .populate("origem")
      .populate("destino")
      .populate("turno")
      .populate("taxi")
      .populate("motorista");

    if (!viagem) {
      return res.status(404).json({ message: "Viagem não encontrada." });
    }

    if (!viagem.inicio || !viagem.turno) {
      return res
        .status(400)
        .json({ message: "A viagem ainda não foi iniciada." });
    }

    const fim = new Date();
    fim.setHours(fim.getHours() + 1);

    if (viagem.inicio >= fim) {
      return res.status(400).json({ message: "Hora de fim inválida." });
    }

    if (viagem.inicio < viagem.turno.inicio || fim > viagem.turno.fim) {
      return res
        .status(400)
        .json({ message: "A viagem deve ocorrer dentro do turno." });
    }

    const overlap = await Viagem.findOne({
      motorista: viagem.motorista,
      _id: { $ne: viagem._id },
      inicio: { $lt: fim },
      fim: { $gt: viagem.inicio },
    });

    if (overlap) {
      return res
        .status(400)
        .json({ message: "O motorista já tem outra viagem nesse período." });
    }
    if (!viagem.origem?.coordenadas || !viagem.destino?.coordenadas) {
      return res.status(400).json({
        message: "Origem ou destino não possuem coordenadas válidas.",
      });
    }
    if (
      !viagem.origem?.coordenadas?.latitude ||
      !viagem.destino?.coordenadas?.latitude
    ) {
      return res.status(400).json({
        message: "Origem ou destino inválidos ou sem coordenadas.",
      });
    }

    const km = calcularDistancia(
      viagem.origem.coordenadas.latitude,
      viagem.origem.coordenadas.longitude,
      viagem.destino.coordenadas.latitude,
      viagem.destino.coordenadas.longitude
    );

    if (km <= 0) {
      return res
        .status(400)
        .json({ message: "Não foi possível calcular a distância." });
    }

    const durationMinutes = Math.floor((fim - viagem.inicio) / 60000);

    const baseRate = viagem.conforto === "LUXUOSO" ? 0.75 : 0.5;
    const nightExtra = viagem.conforto === "LUXUOSO" ? 0.5 : 0.2;
    const startHour = viagem.inicio.getHours();

    const endHour = fim.getHours();

    const isNight =
      startHour >= 21 || startHour < 6 || endHour >= 21 || endHour < 6;
    const rate = isNight ? baseRate * (1 + nightExtra) : baseRate;

    const custo = parseFloat((rate * durationMinutes).toFixed(2));

    viagem.fim = fim;
    viagem.quilometros = km;
    viagem.custo_total = custo;
    viagem.estado = "concluída";

    await viagem.save();

    res.status(200).json(viagem);
  } catch (error) {
    console.error("Erro ao concluir a viagem:", error);
    res.status(500).json({ message: "Erro interno ao concluir a viagem." });
  }
};

exports.listarViagensMotorista = async (req, res) => {
  const { id } = req.params;
  console.log("Motorista ID:", id);
  const viagens = await Viagem.find({ motorista: id, estado: "concluída" })
    .sort({ inicio: -1 })
    .populate("cliente")
    .populate("origem")
    .populate("destino")
    .populate("motorista")
    .populate("taxi")
    .populate("turno");
  res.json(viagens);
};
