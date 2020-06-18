const {Bicicleta} = require('../../models');

exports.bicicleta_list = async function(req, res){
    res.status(200).json({
        bicicletas: Bicicleta.allBicis
    });
}

exports.bicicleta_create = async function(req, res){
    const bici = new Bicicleta.construct(req.body.id, req.body.color, req.body.modelo);
    bici.ubicacion = [req.body.lat, req.body.lng];
    Bicicleta.add(bici);
    res.status(200).send({
        message: 'Ok',
        bici
    });
}

exports.bicicleta_delete = async function(req, res){
    const {id} = req.body;
    Bicicleta.remove(id);
    res.status(204).send();
}

exports.bicicleta_update = async function(req, res){
    const {id} = req.body;
    const update_bici =  Bicicleta.findById(id);
    update_bici.id = req.body.id;
    update_bici.color = req.body.color;
    update_bici.modelo = req.body.modelo;
    update_bici.ubicacion = [req.body.lat, req.body.lng];
    Bicicleta.remove(id);
    Bicicleta.add(update_bici);
    res.status(201).json({
        update_bici
    });
}