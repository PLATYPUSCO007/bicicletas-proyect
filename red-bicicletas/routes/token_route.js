const express = require('express');
const router = express.Router();
const {TokenController} = require('../controllers');

router.get('/confirmation/:token', TokenController.confirmationGet);

module.exports = router;