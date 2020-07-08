const {Usuario} = require('../../models');
const {Reserva} = require('../../models');

exports.usuario_list = async function(req, res){
    const users = await Usuario.find({});
    res.status(200).json({
        users
    });
}

exports.usuario_create = async function(req, res){
    const user = new Usuario({nombre: req.body.nombre, email: req.body.email, password: req.body.password});
    const new_user =  await user.save();
    if(!new_user) res.status(500).json({msg: 'No se guardo el usuario'});
    res.status(200).json(new_user);
}

exports.usuario_reservar = async function(req, res){
    const reserva = await Reserva.create_instance(req.body.since, req.body.until, req.body.biciId, req.body.userId);
    res.status(200).json(reserva);
} 