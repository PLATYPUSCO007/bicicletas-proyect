const {Bicicleta} = require('../models/index');

exports.bicicleta_list = async function(req, res) {
    Bicicleta.allBicis(function(error, bicis){
        res.render('bicicletas', {bicis});
    });
}

exports.bicicleta_create = function(req, res) {
    res.render('create_bicicleta');
}

exports.bicicleta_post = async function(req, res) {
    const new_bici = await Bicicleta.createInstance(req.body.code, req.body.color, req.body.modelo, [req.body.lat, req.body.lng]);
    Bicicleta.add(new_bici);

    res.redirect('/bicicletas');
}

exports.bicicleta_remove = async function(req, res){
    const {bici_id} = req.params;
    await Bicicleta.removeByCode(bici_id); 
    res.redirect('/bicicletas');
}

exports.bicicleta_update = async function(req, res){
    const {code} = req.body;
    const bici_find = await Bicicleta.findByCode(code);
    bici_find.code = req.body.code;
    bici_find.color = req.body.color;
    bici_find.modelo = req.body.modelo;
    bici_find.ubicacion = [req.body.lat, req.body.lng];
    const update_bici = await Bicicleta.update(bici_find._id, bici_find);
    res.redirect('/bicicletas');
}