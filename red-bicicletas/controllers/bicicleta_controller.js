const {Bicicleta} = require('../models/index');

exports.bicicleta_list = function(req, res) {
    res.render('bicicletas', {bicis: Bicicleta.allBicis});
}

exports.bicicleta_create = function(req, res) {
    res.render('create_bicicleta');
}

exports.bicicleta_post = function(req, res) {
    const new_bici = new Bicicleta.construct(req.body.id, req.body.color, req.body.modelo);    
    new_bici.ubicacion = [req.body.lat, req.body.lng];
    Bicicleta.add(new_bici);

    res.redirect('/bicicletas');
}

exports.bicicleta_remove = async function(req, res){
    const {bici_id} = req.params;
    await Bicicleta.remove(bici_id);
    res.redirect('/bicicletas');
}

exports.bicicleta_update = async function(req, res){
    const id_find = req.body.id;
    const bici_update = await Bicicleta.findById(id_find);
    bici_update.color = req.body.color;
    bici_update.modelo = req.body.modelo;
    bici_update.ubicacion = req.body.ubicacion;
    res.redirect('/bicicletas');
}