const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: {type: '2dsphere', sparse: true}
    }
});

bicicletaSchema.methods.toString = async function(){
    return 'code ' + this.code + '| color ' + this.color;
}

bicicletaSchema.statics.allBicis = async function(cb){
    return this.find({}, cb);
}

bicicletaSchema.statics.createInstance = async function (code, color, modelo, ubicacion) { 
    return new this({
        code,
        color,
        modelo,
        ubicacion
    });

}

bicicletaSchema.statics.add = async function(bici, cb){
    this.create(bici, cb);
}

bicicletaSchema.statics.findByCode = async function (biciCode, cb) { 
    return this.findOne({code: biciCode}, cb);
}

bicicletaSchema.statics.removeByCode = async function (biciCode, cb) { 
    return this.deleteOne({code: biciCode}, cb);
}

bicicletaSchema.statics.update = async function(biciId, bici){
    return await this.findByIdAndUpdate(biciId, bici, {new: true, useFindAndModify: false});
}

module.exports = mongoose.model('Bicicleta', bicicletaSchema);
