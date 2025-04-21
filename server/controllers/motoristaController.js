const Pessoa = require('../models/Pessoa');
const Morada = require('../models/Morada');
const Motorista = require('../models/Motorista');

function validarNIF(nif) {
  return typeof nif === 'number' && nif.toString().length === 9 && nif > 0;
}

function calcularIdade(anoNascimento) {
  return new Date().getFullYear() - anoNascimento;
}

function validarCodigoPostal(codigo) {
  return codigoPostal.match(/^(\d{4})-\d{3}$/);
}

function obterLocalidadeSimples(codigoPostal) {
    const prefixo = parseInt(codigoPostal.slice(0, 2), 10);
  
    if (prefixo >= 10 && prefixo <= 19) return "Lisboa";
    if (prefixo >= 20 && prefixo <= 23) return "Santarém";
    if (prefixo === 24 || prefixo === 25) return "Leiria";
    if (prefixo === 26) return "Vila Franca de Xira";
    if (prefixo === 27) return "Amadora";
    if (prefixo === 28) return "Oeiras";
    if (prefixo === 29) return "Setúbal";
  
    if (prefixo === 30 || prefixo === 31) return "Coimbra";
    if (prefixo >= 32 && prefixo <= 34) return "Castelo Branco";
    if (prefixo === 35 || prefixo === 36) return "Viseu";
    if (prefixo === 37 || prefixo === 38) return "Aveiro";
  
    if (prefixo >= 40 && prefixo <= 49) return "Norte";
    if (prefixo >= 50 && prefixo <= 54) return "Trás-os-Montes";
  
    if (prefixo >= 60 && prefixo <= 64) return "Centro Interior";
    if (prefixo >= 70 && prefixo <= 79) return "Alentejo";
    if (prefixo >= 80 && prefixo <= 89) return "Algarve";
    if (prefixo >= 90 && prefixo <= 94) return "Madeira";
    if (prefixo >= 95 && prefixo <= 99) return "Açores";
  
    return null;
  }

exports.registarMotorista = async (req, res) => {
  try {
    const { nome, genero , nif,
            rua, numPorta,codigoPostal, localidade,
            anoNascimento,cartaConducao } = req.body;

    // Validações
    if (!validarNIF(nif)) return res.status(400).json({ erro: 'NIF inválido' });
    if (!['masculino', 'feminino'].includes(genero)) return res.status(400).json({ erro: 'Género inválido' });
    if (calcularIdade(anoNascimento) < 18) return res.status(400).json({ erro: 'Motorista tem menos de 18 anos' });
    if (!validarCodigoPostal(codigoPostal)) return res.status(400).json({ erro: 'Código postal inválido' });
    if (!cartaConducao || typeof cartaConducao !== 'string') return res.status(400).json({ erro: 'Carta de condução inválida' });
    if (!localidade) localidade = obterLocalidadeDoCodigoPostal(codigoPostal);

    // Criar documentos
    const pessoa = new Pessoa({ 
        nome, 
        genero, 
        nif
    });
    await pessoa.save();

    const morada = new Morada({
      rua,
      numPorta,
      codigoPostal,
      localidade
    });
    await morada.save();

    const motorista = new Motorista({
      pessoa: pessoa._id,
      morada: morada._id,
      anoNascimento,
      cartaConducao
    });
    await motorista.save();

    res.status(201).json(motorista);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registar motorista', detalhes: err.message });
  }
};

exports.listarMotoristas = async (req, res) => {
  try {
    const motoristas = await Motorista.find().populate('pessoa').populate('morada').sort({ createdAt: -1 }).exec();
    res.json(motoristas);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar motoristas', detalhes: err.message });
  }
};