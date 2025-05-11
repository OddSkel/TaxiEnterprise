const express = require("express");
const router = express.Router();

const motorista_controller = require("../controllers/motoristaController");


//MOTORISTA ROUTES

router.get("/nif/:nif", motorista_controller.getMotoristaByNIF);

router.get("/search", motorista_controller.getNIFS);

//TURNO ROUTES

router.post("/turnos/motoristas/:id/", turno_controller.requestTaxiforShift);

router.get("/turnos/motoristas/:id/", turno_controller.getAllShifts);

router.get("/turnos/motoristas/:id/turno", turno_controller.getAvailableTaxisForShift);

//VIAGEM ROUTES

router.get("/viagens-pendentes", viagem_controller.listarPedidos);

router.post("/aceitar-pedido/:viagemId", viagem_controller.aceitarPedido);

module.exports = router;