const express = require('express');
const router = express.Router();

motorista_controller = require('../controllers/motoristaController');
cli_controller = require('../controllers/clienteController');
taxi_controller = require('../controllers/taxiController');

//MOTORISTA ROUTES

router.get('/motoristas', motorista_controller.listarMotoristas);

router.post('/motoristas', motorista_controller.criarMotorista);

module.exports = router;