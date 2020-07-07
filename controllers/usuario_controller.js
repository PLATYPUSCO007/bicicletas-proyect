const {Usuario} = require('../models');

module.exports = {
    list: async function (req, res, next) { 
        const usuarios = await Usuario.find().catch(e => console.log(e));
        res.render('usuarios/index', {usuarios});
    }, 

    update_get: async function (req, res, next) {  
        const usuario = await Usuario.findById(req.params.id);
        res.render('usuarios/update', {errors:{}, usuario});
    },

    update: async function (req, res, next) {  
        const values_update = {nombre: req.body.name};
        const update_user =  await Usuario.findByIdAndUpdate(req.params.id, values_update, {new: true, useFindAndModify: false});
        if(update_user){
            res.redirect('/usuarios');
            return
        }else{
            res.render('usuarios/update', {errors: err.errors, usuario: new Usuario({nombre: req.body.name, email: req.body.email})});
        }   
    },

    create_get: async function (req, res, next) {  
        res.render('usuarios/create', {errors: {}, usuario: new Usuario()});
    },

    create: async function (req, res, next) {  
        if(req.body.pass != req.body.confirmPass){
            res.render('usuarios/create', {errors: {confirm_password: {message: 'Las contraseñas no coinciden'}, usuario: new Usuario({nombre: req.body.name, email: req.body.mail})}});
            return;
        }
        const new_user = new Usuario({nombre: req.body.name, email: req.body.mail, password: req.body.pass});
        const result = await Usuario.create(new_user).catch(e => res.render('usuarios/create', {errors: e.errors, usuario: new Usuario({nombre: req.body.name, email: req.body.mail})}));
        if(result){
            new_user.send_mail();
            res.redirect('/usuarios');
        }
    },
    delete: async function (req, res, next) {  
        const delete_user =  await Usuario.findByIdAndDelete(req.body.id).catch(e => next(e));
        if(delete_user){
            res.redirect('/usuarios');
        }
    }
}   