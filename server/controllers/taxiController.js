const Taxi = require("../models/taxi");
const Pessoa = require("../models/pessoa");
const Morada = require("../models/morada");
const Motorista = require("../models/motorista");
const Cliente = require("../models/cliente");

const express = require("express");
const router = express.Router();

router.get("/init", async (req, res) => {
  try {
    await Taxi.deleteMany({});
    await Motorista.deleteMany({});
    await Cliente.deleteMany({});

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
      createdAt: new Date(2019, 0, 1),
      motorista: motorista._id,
      cliente: cliente._id,
    });

    console.log("Taxi created:", taxi1);

    res.status(200).json({ message: "Database initialized successfully" });
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).json({ message: "Error initializing database", error });
  }
});

// /taxi/:id - Get hero by id
router.get("/taxi/:id", async (req, res) => {
  try {
    const taxiId = req.params.id;

    const taxi = await Taxi.findById(taxiId); // Fetch taxi by ID from MongoDB

    if (!taxi) {
      return res.status(404).json({ message: "taxi not found" });
    }

    res.json(taxi); // Send hero details as JSON
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//taxis - get all taxis
router.get("/taxis", async (req, res) => {
  try {
    const taxis = await Taxi.find()
      .sort({ createdAt: -1 })
      .populate("motorista")
      .populate("cliente"); // Populate the entire pet document
    res.json(taxis);
  } catch (error) {
    console.error("Error fetching taxis:", error);
    res.status(500).json({ message: "Error fetching taxis", error });
  }
});

/* POST home page. */
router.post("/taxis", async (req, res) => {
  try {
    const {
      matricula,
      ano_compra,
      marca,
      modelo,
      nivel_conforto,
      createdAt,
      motorista,
      cliente,
    } = req.body;

    if (
      !matricula ||
      !ano_compra ||
      !marca ||
      !modelo ||
      !nivel_conforto ||
      !createdAt ||
      !motorista ||
      !cliente
    ) {
      return res.status(400).json({ message: "You're missing requirements!" });
    }

    let number = 0;
    let letter = 0;
    for (let char of matricula) {
      if (/[A-Z]/.test(char)) {
        letter++;
      } else if (/[0-9]/.test(char)) {
        number++;
      } else {
        return res.status(400).json({ message: "Matricula incorreta!" });
      }
    }

    if (number != 2 || letter != 4) {
      return res.status(400).json({
        message: "Matricula com numero incorreto de letras e numeros!",
      });
    }

    if (ano_compra - createdAt < 0) {
      return res.status(400).json({
        message: "O taxi não pode ter sido criado depois de teres comprado!",
      });
    }

    const mot = await Motorista.findById(motorista);
    if (!mot) {
      return res.status(404).json("Driver not found!");
    }

    const taxi = new Taxi({
      matricula,
      ano_compra,
      marca,
      modelo,
      nivel_conforto,
      createdAt,
      motorista,
      cliente,
    });

    const savedTaxi = await taxi.save();
    res.json(savedTaxi);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.entries(err.errors).map(([field, err]) => ({
        field,
        message: err.message,
      }));
      return res
        .status(400)
        .json({ message: "Validation failed", errors: messages });
    }
    res.status(400).json({ error: err.message });
  }
});

router.delete("/taxi/:id", async (req, res) => {
  try {
    const taxiId = req.params.id;
    const result = await Taxi.findByIdAndDelete(taxiId);
    if (!result) {
      return res.status(404).json({ error: "Taxi not found" });
    }
    res.json({ message: "Taxi deleted" });
  } catch (error) {
    console.error("Error deleting taxi:", error);
    res.status(500).json({ message: "Error deleting taxi", error });
  }
});

module.exports = router;
