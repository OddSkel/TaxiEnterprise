const express = require('express');
const router = express.Router();

const Taxi = require("../models/taxi");
const Pessoa = require("../models/pessoa");
const Morada = require("../models/morada");
const Motorista = require("../models/motorista");
const Cliente = require("../models/cliente");

motorista_controller = require('../controllers/motoristaController');
cli_controller = require('../controllers/clienteController');
taxi_controller = require('../controllers/taxiController');

router.get("/init", async (req, res) => {
  try {
    await Taxi.deleteMany({});
    await Motorista.deleteMany({});
    await Cliente.deleteMany({});
    await Pessoa.deleteMany({});
    await Morada.deleteMany({});

    const pessoa = await Pessoa.create({
      nome: "Augusto",
      genero: "M",
      nif: "123456789",
    });

    const morada = await Morada.create({
      rua: "Alberto3",
      numPorta: "34",
      codigoPostal: "3456-987",
      localidade: "Lisboa",
    });

    const motorista = await Motorista.create({
      pessoa: pessoa._id,
      morada: morada._id,
      anoNascimento: 1997,
      cartaConducao: "ABCD12345",
    });

    const cliente = await Cliente.create({ name: "Alberto" });

    const taxi1 = await Taxi.create({
      matricula: "DF65SA",
      ano_compra: 2020,
      marca: "BMW",
      modelo: "M50",
      nivel_conforto: "LUXUOSO",
      createdAt: 2019,
    });

    console.log("Taxi created:", taxi1);

    res.status(200).json({ message: "Database initialized successfully" });
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).json({ message: "Error initializing database", error });
  }
});

//MOTORISTA ROUTES

router.get('/motoristas', motorista_controller.getMotoristas);

router.post('/motorista', motorista_controller.createMotorista);

router.get('/motorista/:id', motorista_controller.getMotoristaById);

router.delete('/motorista/:id', motorista_controller.deleteMotorista);

router.put('/motorista/:id', motorista_controller.updateMotorista);


//TAXI ROUTES

router.get("/taxis/:id",taxi_controller.getTaxiById);

router.get("/taxis",taxi_controller.getTaxis);

router.post("/taxis",taxi_controller.createTaxi);

router.delete("/taxis/:id",taxi_controller.deleteTaxi);

router.put("/taxis/:id",taxi_controller.updateTaxi);



module.exports = router;