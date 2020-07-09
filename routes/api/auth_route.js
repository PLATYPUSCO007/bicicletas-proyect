const express = require('express');
const router = express.Router();
const {AuthController} = require('../../controllers/api');
const passport = require('../../config/passport');

router.post('/authenticate', AuthController.authenticate);
router.post('/forgotPassword', AuthController.forgotPassword);
router.post('/facebook_token', passport.authenticate('facebook-token'), AuthController.authFacebookToken);

module.exports = router;