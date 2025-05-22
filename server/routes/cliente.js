const express = require('express');
const router = express.Router();

const viagem_controller = require("../controllers/viagemController");

router.post("/pedirViagem", viagem_controller.pedirViagem);

router.post("/:clienteId/confirmar/:viagemId", viagem_controller.clienteConfirmar);

router.post("/:clienteId/rejeitar/:viagemId", viagem_controller.clienteRejeitar);

router.post("/:clienteId/cancelar/:viagemId", viagem_controller.clienteCancelar);

router.get("/getViagem/:id",viagem_controller.getViagemById);

module.exports = router;