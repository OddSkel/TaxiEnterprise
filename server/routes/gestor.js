const express = require("express");
const router = express.Router();

const Taxi = require("../models/taxi");
const Pessoa = require("../models/pessoa");
const Morada = require("../models/morada");
const Motorista = require("../models/motorista");
const Cliente = require("../models/cliente");
const Viagem = require("../models/viagem");
const Turno = require("../models/turno");

motorista_controller = require("../controllers/motoristaController");
taxi_controller = require("../controllers/taxiController");
conforto_controller = require("../controllers/confortoController");
viagem_controller = require("../controllers/viagemController");
turno_controller = require("../controllers/turnoController");

router.get("/init", async (req, res) => {
  try {
    await Taxi.deleteMany({});
    await Motorista.deleteMany({});
    await Cliente.deleteMany({});
    await Pessoa.deleteMany({});
    await Morada.deleteMany({});
    await Turno.deleteMany({});
    await Viagem.deleteMany({});
    await Cliente.deleteMany({});

    const pessoa = await Pessoa.create({
      nome: "Augusto",
      genero: "masculino",
      nif: "123456789",
    });

    const pessoa1 = await Pessoa.create({
      nome: "Elsa",
      genero: "feminino",
      nif: "111111111",
    });

    const morada = await Morada.create({
      rua: "Alberto3",
      numPorta: "34",
      codigoPostal: "1000-987",
      localidade: "Lisboa",
    });

    const cliente = await Cliente.create({
      pessoa: pessoa1._id,
    });

    const motorista = await Motorista.create({
      pessoa: pessoa._id,
      morada: morada._id,
      anoNascimento: 1997,
      cartaConducao: "ABCD12345",
    });

    const taxi1 = await Taxi.create({
      matricula: "DF65SA",
      ano_compra: 2020,
      marca: "BMW",
      modelo: "M50",
      nivel_conforto: "LUXUOSO",
    });

    res.status(200).json({ message: "Database initialized successfully" });
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).json({ message: "Error initializing database", error });
  }
});

//MOTORISTA ROUTES

router.get("/motoristas", motorista_controller.getMotoristas);

router.post("/motoristas", motorista_controller.createMotorista);

router.get("/motoristas/:id", motorista_controller.getMotoristaById);

router.delete("/motoristas/:id", motorista_controller.deleteMotorista);

router.put("/motoristas/:id", motorista_controller.updateMotorista);

router.get("/motoristas/nif/:nif", motorista_controller.getMotoristaByNIF);

router.get("/motoristas/search", motorista_controller.getNIFS);

//TAXI ROUTES

router.get("/taxis/:id", taxi_controller.getTaxiById);

router.get("/taxis", taxi_controller.getTaxis);

router.post("/taxis", taxi_controller.createTaxi);

router.delete("/taxis/:id", taxi_controller.deleteTaxi);

router.put("/taxis/:id", taxi_controller.updateTaxi);

router.get("/taxi/:taxiId/turnos", turno_controller.getAllTaxiShifts);

//CONFORTO ROUTES

router.get("/conforto", conforto_controller.getConfortos);

router.get("/conforto/:id", conforto_controller.conforto_details);

router.put("/conforto/:id", conforto_controller.conforto_update);

router.get("/conforto/simular/:id", conforto_controller.conforto_details);

router.get("/conforto/nome/:id", conforto_controller.getConfortoByName);

router.get("/viagens", viagem_controller.getViagens);

module.exports = router;
