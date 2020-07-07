const express = require('express');
const router = express.Router();
const {AuthController} = require('../../controllers/api');

router.post('/authenticate', AuthController.authenticate);
router.post('/forgotPassword', AuthController.forgotPassword);

module.exports = router;