const express = require('express');
const Router = express.Router();
const {ReservaController} = require('../../controllers/api');

Router.get('/all', ReservaController.reserva_list);
Router.post('/bicicletas', ReservaController.reserva_by_bicicleta);
Router.post('/usuarios', ReservaController.reserva_by_usuario);

module.exports = Router;