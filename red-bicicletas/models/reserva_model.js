const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const reservaSchema = new Schema({
    since: Date,
    until: Date,
    bicicleta: {type: mongoose.Schema.Types.ObjectId, ref: 'Bicicleta'},
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'}
});

reservaSchema.methods.diasDeReserva = function(){
    return moment(this.until).diff(moment(this.since), 'days') + 1;   
}

reservaSchema.statics.create_instance = async function(since, until, bicicleta, usuario){
    return new this({
        since, 
        until,
        bicicleta,
        usuario
    }).save();
}

module.exports = mongoose.model('Reserva', reservaSchema);