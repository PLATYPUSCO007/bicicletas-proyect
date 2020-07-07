const express = require('express');
const Router = express.Router();
const {BicicletaController} = require('../controllers');

Router.get('/', BicicletaController.bicicleta_list);
Router.get('/create', BicicletaController.bicicleta_create);
Router.post('/create', BicicletaController.bicicleta_post);
Router.get('/remove/:bici_id', BicicletaController.bicicleta_remove);
Router.post('/', BicicletaController.bicicleta_update);

module.exports = Router; 