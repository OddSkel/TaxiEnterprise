const express = require('express');
const router = express.Router();

const viagem_controller = require("../controllers/viagemController");

router.post("/pedirViagem", viagem_controller.pedirViagem);

router.post("/:clienteId/confirmar/:viagemId", viagem_controller.clienteConfirmar);

router.post("/:clienteId/rejeitar/:viagemId", viagem_controller.clienteRejeitar);

module.exports = router;