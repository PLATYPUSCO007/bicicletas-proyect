const {Usuario} = require('../../models');
const {Reserva} = require('../../models');
const {Bicicleta} = require('../../models');
const request = require('request');
const mongoose = require('mongoose');
const server = require('../../bin/www');

describe('Test API', () => {
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

    describe('GET USUARIOS', ()=>{
        it('Status 200', ()=>{
            request.get('http://localhost:3000/api/usuarios', function(error, response, body){
                if(error)
                    console.log(error);
                expect(response.statusCode).toBe(200);
                expect(JSON.parse(body).users.length).toBe(0);
            });
        });
    });

    describe('POST USUARIOS CREATE', ()=>{
        it('Status 200', (done)=>{
            const headers = {
                'Content-Type': 'application/json'
            }
            const aUser = '{"nombre": "Juana"}';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/usuarios/create',
                body: aUser
            },
            function(error, response, body){
                if(error)
                    console.log(error);
                expect(response.statusCode).toBe(200);
                expect(JSON.parse(body).nombre).toBe(JSON.parse(aUser).nombre);
                done();
            });
        })
    });

    describe('POST USUARIOS RESERVAR', ()=>{
        it('Status 200', (done)=>{
            const headers = {
                'Content-Type': 'application/json'
            }
            const aUser = '{"nombre": "Juana"}';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/usuarios/create',
                body: aUser
            },
            function(error, response, body){
                if(error)
                    console.log(error);
                expect(response.statusCode).toBe(200);
                const idUser = JSON.parse(body)._id;
                const aBici = '{"code": 80, "color": "rosa", "modelo": "carrera", "lat": -34, "lng": 45}';
                request.post({
                    headers: headers,
                    url: 'http://localhost:3000/api/create',
                    body: aBici
                },
                function(error, response, body){
                    expect(response.statusCode).toBe(200);
                    const today = new Date();
                    const reserva = `{"since": "${today}", "until": "${today +1}", "biciId": "${JSON.parse(body).bici._id}", "userId": "${idUser}"}`;
                    request.post({
                        headers: headers,
                        url: 'http://localhost:3000/api/usuarios/reserva',
                        body: reserva
                    },
                    function(error, response, body){
                        if(error)
                            console.log(error);
                        expect(response.statusCode).toBe(200);
                        console.log(body);
                        
                        done();
                    });
                });
            });
        });
    });

});