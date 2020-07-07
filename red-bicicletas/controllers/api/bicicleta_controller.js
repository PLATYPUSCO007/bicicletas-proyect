const {Bicicleta} = require('../../models');

exports.bicicleta_list = async function(req, res){
    Bicicleta.allBicis(function(error, bicis){
        res.status(200).json({
            bicicletas: bicis
        });
    });
}

exports.bicicleta_create = async function(req, res){
    const bici = await Bicicleta.createInstance(req.body.code, req.body.color, req.body.modelo, [req.body.lat, req.body.lng]);
    Bicicleta.add(bici);
    res.status(200).send({
        message: 'Ok',
        bici
    });
}

exports.bicicleta_delete = async function(req, res){
    const {code} = req.body;
    Bicicleta.removeByCode(code);
    res.status(204).send();
}

exports.bicicleta_update = async function(req, res){
    const {_id} = req.body;
    const bicicleta = `{"code": ${req.body.code}, "color": ${req.body.color}, "modelo": ${req.body.modelo}, "ubicacion" [${req.body.lat}, ${req.body.lng}]}`;
    const update_bici = await Bicicleta.update(_id, bicicleta);
    res.status(201).json({
        update_bici
    });
}