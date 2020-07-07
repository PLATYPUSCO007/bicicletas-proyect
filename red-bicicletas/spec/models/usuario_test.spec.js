const {Usuario} = require('../../models');
const {Reserva} = require('../../models');
const {Bicicleta} = require('../../models');
const mongoose = require('mongoose');

describe('Testing Usuarios', function(){
    beforeEach(function(done) {
        const url = 'mongodb://localhost/test_bicicletas';
        mongoose.connect(url, {useNewUrlParser: true,  useUnifiedTopology: true});
        
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error'));
        db.once('open', function() {
            console.log('Connect to test database');
            console.log('Testing is comming');
            done();
        });
    });

    afterEach(function(done){
        Reserva.deleteMany({}).then((result)=>{
            console.log('Clearning database Reserva', result);
            Usuario.deleteMany({}).then((result)=>{
                console.log('Clearning database Usuario', result);
                Bicicleta.deleteMany({}).then(()=>{
                    console.log('Clearning database Bicicleta', result);
                    done();
                }).catch(error => console.error('Delete fail with error', error));
            }).catch(error => console.error('Delete fail with error', error));;
        }).catch(error => console.error('Delete fail with error', error));;
    });

    describe(' * Reserva una bicicleta', ()=>{
        it('Debe existir el usuario y bicicleta', (done)=>{
            const user = new Usuario({nombre: 'Pedro'});
            user.save();
            const bicicle = new Bicicleta({code: 5, color: 'verde', modelo: 'Montaña', ubicacion: [-67.771, 53.412]});
            bicicle.save();

            let today = new Date();
            let tomorrow = new Date();
            tomorrow.setDate(today.getDate()+1);
            const reserva = new Reserva({since: today, until: tomorrow, bicicleta: bicicle.id, usuario: user.id});
            console.log(reserva);
            reserva.save().then(data => {
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(error, reservas){ 
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(5);
                    expect(reservas[0].usuario.nombre).toBe(user.nombre);
                    done();
                });
            });
        });
    });
});