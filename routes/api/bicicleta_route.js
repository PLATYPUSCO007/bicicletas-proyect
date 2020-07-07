const express = require('express');
const Router = express.Router();
const {BicicletaController} = require('../../controllers/api');

Router.get('/', BicicletaController.bicicleta_list);
Router.post('/create', BicicletaController.bicicleta_create);
Router.post('/delete', BicicletaController.bicicleta_delete);
Router.post('/update', BicicletaController.bicicleta_update);

module.exports = Router; 