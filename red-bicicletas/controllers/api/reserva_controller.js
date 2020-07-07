const {Reserva} = require('../../models');

exports.reserva_list = async function(req, res){
    const reservas = await Reserva.find({});
    res.status(200).json(reservas);
}

exports.reserva_by_bicicleta = async function(req, res){
    const reservas = await Reserva.find({bicicleta: req.body.bicicleId});
    res.status(200).json(reservas);
}

exports.reserva_by_usuario = async function(req, res){
    const reservas = await Reserva.find({usuario: req.body.usuarioId});
    res.status(200).json(reservas);
}