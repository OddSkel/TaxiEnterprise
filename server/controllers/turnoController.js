const Motorista = require("../models/motorista");
const Turno = require("../models/turno");
const Taxi = require("../models/taxi");

exports.requestTaxiforShift = async (req, res) => {
  try {
    const { periodo, taxi } = req.body;
    if (!periodo || !taxi) {
      return res
        .status(400)
        .json({ error: "Missing shift or taxi information" });
    }

    const { start, end } = periodo;
    const { matricula } = taxi;

    const driver_id = req.params.id;
    const motorista = await Motorista.findById(driver_id)
      .populate("pessoa")
      .populate("morada")
      .exec();
    if (!motorista)
      return res.status(404).json({ erro: "Motorista nao encontrado" });

    // Validate shift times
    if (start > end) {
      return res
        .status(400)
        .json({ error: "Can't begin a shift after it ended!" });
    }
    let startTime = new Date(periodo.start);
    let endTime = new Date(periodo.end);
    let duration = (endTime - startTime) / (1000 * 60 * 60); // in hours
    if (duration > 8) {
      return res
        .status(400)
        .json({ error: "Shift can't be for more than 8 hours!" });
    }
    let now = new Date();
    now.setHours(now.getHours() + 1);

    if (startTime < now) {
      return res.status(400).json({ error: "Shift can't begin in the past!" });
    }

    // Check for overlapping shifts (RIA 8)
    const overlapping = await Turno.findOne({
      motorista: driver_id,
      $or: [{ start: { $lt: end }, end: { $gt: start } }],
    });
    if (overlapping) {
      return res
        .status(400)
        .json({ error: "Shift overlaps with another existing shift!" });
    }

    // Find the taxi by matricula
    const taxiFound = await Taxi.findOne({ matricula: matricula });
    if (!taxiFound) {
      return res
        .status(404)
        .json({ erro: "Taxi with this matricula not found" });
    }

    // Check for available taxis in the time range
    const busyTaxis = await Turno.find({
      $or: [{ start: { $lt: end }, end: { $gt: start } }],
    }).distinct("taxi");

    const availableTaxis = await Taxi.find({ _id: { $nin: busyTaxis } });
    const isAvailable = availableTaxis.some((t) => t.matricula === matricula);

    if (!isAvailable) {
      return res.status(400).json({
        error: "Selected taxi is not available for the given shift period!",
      });
    }

    // Create the shift
    const shift = new Turno({
      start,
      end,
      motorista: driver_id,
      taxi: taxiFound._id,
    });

    // Save the shift
    await shift.save();

    // Return all shifts of the driver sorted by start date
    const allShifts = await Turno.find({ motorista: driver_id })
      .populate("taxi")
      .sort({ start: 1 });

    return res.status(201).json({ message: "Shift created", allShifts });
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Error while registering shift", detalhes: error.message });
  }
};

exports.getAllShifts = async (req, res) => {
  try {
    const turnos = await Turno.find()
      .populate("taxi")
      .populate("motorista")
      .sort({ start: 1 })
      .exec();
    res.json(turnos);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao listar turnos", detalhes: err.message });
  }
};

exports.getAvailableTaxisForShift = async (req, res) => {
  try {
    const driver_id = req.params.id;

    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ error: "Start and end times are required." });
    }

    const startTime = new Date(start.trim());
    const endTime = new Date(end.trim());

    if (isNaN(startTime) || isNaN(endTime)) {
      return res.status(400).json({
        error: "Invalid date format",
        details: "Please use ISO format: YYYY-MM-DDTHH:mm:ssZ",
      });
    }

    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ error: "Start time must be before end time." });
    }

    const now = new Date();
    if (startTime < now) {
      return res.status(400).json({ error: "Shift can't begin in the past!" });
    }

    // Buscar IDs de táxis ocupados no período
    const busyTaxis = await Turno.find({
      start: { $lt: endTime },
      end: { $gt: startTime },
    }).distinct("taxi");

    // Táxis disponíveis
    const availableTaxis = await Taxi.find({ _id: { $nin: busyTaxis } });

    return res.status(200).json({ availableTaxis });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch available taxis.",
      details: error.message,
    });
  }
};
