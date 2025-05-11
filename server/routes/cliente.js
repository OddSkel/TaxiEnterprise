const express = require('express');
const router = express.Router();

const viagem_controller = require("../controllers/viagemController");

router.post("/pedirViagem", viagem_controller.pedirViagem);

module.exports = router;