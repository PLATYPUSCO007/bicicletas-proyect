const {Usuario, Token} = require('../models');
const e = require('express');

module.exports = {
    confirmationGet: async function(req, res, next){
        const token = await Token.findOne({token: req.params.token}).catch(e);
        if(!token){
            return res.status(400).send({type: 'not-verified', msg: 'No existe el token'});
        }
        const user = await Usuario.findById(token._userId).catch(e);
        if(!user){
            return res.status(400).send({msg: 'No se se encontro el usuario'});
        }
        if(user.verificado){
            return res.redirect('/usuarios');
        }
        user.verify = true;
        const save_user = await user.save().catch(e => {return res.status(500).send({msg: e.message})});
        if(save_user)
            res.redirect('/');
    }
} 