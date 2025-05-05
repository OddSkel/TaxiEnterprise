const Taxi = require("../models/taxi");
const { marcas, confortos, modelos } = require("../models/taxi");

// /taxi/:id - Get hero by id
exports.getTaxiById = async (req, res) => {
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
};

//taxis - get all taxis
exports.getTaxis = async (req, res) => {
  try {
    const taxis = await Taxi.find().sort({ createdAt: -1 });
    res.json(taxis);
  } catch (error) {
    console.error("Error fetching taxis:", error);
    res.status(500).json({ message: "Error fetching taxis", error });
  }
};

//taxis - create new taxi
exports.createTaxi = async (req, res) => {
  try {
    const { matricula, ano_compra, marca, modelo, nivel_conforto } = req.body;

    if (!matricula || !ano_compra || !marca || !modelo || !nivel_conforto) {
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
    let current_Year = new Date().getFullYear();
    if (ano_compra - current_Year > 0) {
      return res.status(400).json({
        message: "Validation failed",
        fieldErrors: {
          ano_compra: "O taxi não pode ter sido criado no futuro!",
        },
      });
    }

    if (marcas && !marcas.includes(marca)) {
      return res.status(400).json({
        message: "Validation failed",
        fieldErrors: {
          marca: "O taxi não pode ter essa marca",
        },
      });
    }

    if (modelos && !modelos.includes(modelo)) {
      return res.status(400).json({
        message: "Validation failed",
        fieldErrors: {
          modelo: "O taxi não pode ter essa modelo",
        },
      });
    }

    if (confortos && !confortos.includes(nivel_conforto)) {
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
};

exports.deleteTaxi = async (req, res) => {
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
};

exports.updateTaxi = async (req, res) => {
  try {
    const { matricula, ano_compra, marca, modelo, nivel_conforto } = req.body;
    const updateTaxi = await Taxi.findByIdAndUpdate(
      req.params.id,
      { matricula, ano_compra, marca, modelo, nivel_conforto },
      { new: true }
    ).exec();
    updateTaxi
      ? res.json(updateTaxi)
      : res.status(404).json({ message: "Didn't find taxi" });
  } catch (error) {
    console.error("Error putting taxis:", error);
    res.status(500).json({ message: "Error putting taxis", error });
  }
};

function formatValidationErrors(error) {
  const fieldErrors = {};
  for (const [path, errorDetail] of Object.entries(error.errors)) {
    fieldErrors[path] = errorDetail.message;
  }
  return fieldErrors;
}
