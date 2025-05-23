const express = require("express");
const router = express.Router();

const motorista_controller = require("../controllers/motoristaController");
const turno_controller = require("../controllers/turnoController");
const viagem_controller = require("../controllers/viagemController");

//MOTORISTA ROUTES

router.get("/nif/:nif", motorista_controller.getMotoristaByNIF);

router.get("/search", motorista_controller.getNIFS);

//TURNO ROUTES

router.post("/turnos/motoristas/:id/", turno_controller.requestTaxiforShift);

router.get("/turnos/motoristas/:id/", turno_controller.getAllShifts);

router.get("/turnos/motoristas/:id/turno", turno_controller.getAvailableTaxisForShift);

router.get("/turnos/motoristas/:id", turno_controller.getAllTaxiShifts);

//VIAGEM ROUTES

router.get("/:motoristaId/viagens-pendentes/", viagem_controller.listarPedidos);

router.post("/:motoristaId/aceitar-viagem/:viagemId", viagem_controller.aceitarPedido);

router.post("/detalhes/:id/start", viagem_controller.startViagem);

router.post("/detalhes/:id/end", viagem_controller.endViagem);

router.get("/detalhes/:id/viagens", viagem_controller.listarViagensMotorista);

module.exports = router;
