const express = require('express');
const Router = express.Router();
const {UsuarioController} = require('../../controllers/api');

Router.get('/', UsuarioController.usuario_list);
Router.post('/create', UsuarioController.usuario_create);
Router.post('/reserva', UsuarioController.usuario_reservar);

module.exports = Router; 