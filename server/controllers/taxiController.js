const Taxi = require("../models/taxi");
const Pessoa = require("../models/pessoa");
const Morada = require("../models/morada");
const Motorista = require("../models/motorista");
const Cliente = require("../models/cliente");
const { marcas, confortos, modelos } = require("../models/taxi");

const express = require("express");
const router = express.Router();

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

// /taxi/:id - Get hero by id
router.get("/taxis/:id", async (req, res) => {
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
    const taxis = await Taxi.find().sort({ createdAt: -1 });
    res.json(taxis);
  } catch (error) {
    console.error("Error fetching taxis:", error);
    res.status(500).json({ message: "Error fetching taxis", error });
  }
});

/* POST home page. */
router.post("/taxis", async (req, res) => {
  try {
    const { matricula, ano_compra, marca, modelo, nivel_conforto, createdAt } =
      req.body;

    if (
      !matricula ||
      !ano_compra ||
      !marca ||
      !modelo ||
      !nivel_conforto ||
      !createdAt
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
        return res.status(400).json({
          message: "Matricula incorreta!",
          fieldErrors: {
            matricula: "Matricula Incorreta!",
          },
        });
      }
    }

    if (number != 2 || letter != 4) {
      return res.status(400).json({
        message: "Validation failed",
        fieldErrors: {
          matricula: "Matricula com numero incorreto de letras e numeros!",
        },
      });
    }

    if (ano_compra - createdAt < 0) {
      return res.status(400).json({
        message: "Validation failed",
        fieldErrors: {
          ano_compra:
            "O taxi não pode ter sido criado depois de teres comprado!",
        },
      });
    }

    if (!marcas.include(marca)) {
      return res.status(400).json({
        message: "Validation failed",
        fieldErrors: {
          marca: "O taxi não pode ter essa marca",
        },
      });
    }

    if (!modelos.include(modelo)) {
      return res.status(400).json({
        message: "Validation failed",
        fieldErrors: {
          modelo: "O taxi não pode ter essa modelo",
        },
      });
    }

    if (!nivel_conforto.include(nivel_conforto)) {
      return res.status(400).json({
        message: "Validation failed",
        fieldErrors: {
          nivel_conforto: "O taxi não pode ter esse nivel de conforto",
        },
      });
    }

    const taxi = new Taxi({
      matricula,
      ano_compra,
      marca,
      modelo,
      nivel_conforto,
      createdAt,
    });

    const savedTaxi = await taxi.save();
    res.json(savedTaxi);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Send back a structured error message
      return res.status(400).json({
        message: "Validation failed",
        fieldErrors: formatValidationErrors(error),
      });
    }
    // Handle other errors (like database issues, etc.)
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/taxis/:id", async (req, res) => {
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

router.put("/taxis/:id", async (req, res) => {
  try {
    const { matricula, ano_compra, marca, modelo, nivel_conforto, createdAt } =
      req.body;
    const updateTaxi = await Taxi.findByIdAndUpdate(
      req.params.id,
      { matricula, ano_compra, marca, modelo, nivel_conforto, createdAt },
      { new: true }
    ).exec();
    updateTaxi
      ? res.json(updateTaxi)
      : res.status(404).json({ message: "Didn't find taxi" });
  } catch (error) {
    console.error("Error putting taxis:", error);
    res.status(500).json({ message: "Error putting taxis", error });
  }
});

function formatValidationErrors(error) {
  const fieldErrors = {};
  for (const [path, errorDetail] of Object.entries(error.errors)) {
    fieldErrors[path] = errorDetail.message;
  }
  return fieldErrors;
}

module.exports = router;
