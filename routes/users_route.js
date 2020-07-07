const express = require('express');
const router = express.Router();
const {UsuarioController} = require('../controllers');

/* GET users listing. */
router.get('/', UsuarioController.list);
router.get('/create', UsuarioController.create_get);
router.get('/:id/update', UsuarioController.update_get);
/* POST users listing. */
router.post('/create', UsuarioController.create);
router.post('/:id/update', UsuarioController.update);
router.post('/:id/delete', UsuarioController.delete);

module.exports = router;
 