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
            done();
        });
    });

    afterEach(function(done){
        Bicicleta.deleteMany({}, function(error, success){
            if(error)
                console.log(error);
            done();
        });
    });

    describe('GET BICICLETAS', ()=>{
        it('Status 200', ()=>{
            request.get('http://localhost:3000/api', function(error, response, body){
                expect(response.statusCode).toBe(200);
                expect(JSON.parse(body).bicicletas.length).toBe(0);
            });
        });
    });


    describe('POST CREATE BICICLETAS', ()=>{
        it('Status 200 and object bici', (done)=>{
            const headers = {
                'Content-Type': 'application/json'
            }
            const aBici = '{"code": 10, "color": "morado", "modelo": "BMX", "lat": -34, "lng": 45}';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/create',
                body: aBici
            },
            function(error, response, body){
                if(error)
                    console.log(error);
                expect(response.statusCode).toBe(200);
                done();
            });   
        });
    });

    describe('DELETE BICICLETAS', ()=>{
        it('Status 204', (done)=>{
            const headers = {
                'Content-Type': 'application/json'
            }
            const aBici = '{"code": 30, "color": "chuachua", "modelo": "BMX", "lat": -34, "lng": 45}';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/create',
                body: aBici
            },
            function(error, response, body){
                if(error)
                    console.log(error);
                expect(response.statusCode).toBe(200);
                expect(JSON.parse(body).bici.code).toBe(30);
            });
            const code = '{"code": 30}';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/delete',
                body: code
            },
            function(error, response, body){
                expect(response.statusCode).toBe(204);
                done();
            });
        });
    });

    describe('UPDATE BICICLETAS', ()=>{
        it('Status 201', (done)=>{
            const headers = {
                'Content-Type': 'application/json'
            }
            const aBici = '{"code": 80, "color": "rosa", "modelo": "carrera", "lat": -34, "lng": 45}';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/create',
                body: aBici
            },
            function(error, response, body){
                expect(response.statusCode).toBe(200);
                expect(JSON.parse(body).bici.code).toBe(80);
                expect(JSON.parse(body).bici.color).toBe('rosa');
                done();
                Bicicleta.findByCode(80).then(data => {
                    const up_bici = '{"_id": '+ data._id +' "code": 80, "color": "aguamarina", "modelo": "Montaña", "lat": -34, "lng": 45}';

                    request.post({
                        headers: headers,
                        url: 'http://localhost:3000/api/update',
                        body: up_bici
                    },
                    function(error, response, body){
                        expect(response.statusCode).toBe(201);
                        expect(JSON.parse(body).update_bici.code).toBe(80);
                        expect(JSON.parse(body).update_bici.color).toBe('aguamarina');
                        done();
                    });
                });
            });
        });
    }); 

});

/* describe('GET BICICLETAS', ()=>{
    it('Status 200', ()=>{
        expect(Bicicleta.allBicis.length).toBe(0);

        const a = new Bicicleta.construct(1, 'verde', 'BMX', [6.2334221, -75.5910816]);
        Bicicleta.add(a);

        request.get('http://localhost:27017:3000/api', function(error, response, body){
            expect(response.statusCode).toBe(200);
        })
    });
});

describe('POST BICICLETAS /CREATE', ()=>{
    it('STATUS CODE 200', (done)=>{
        const headers = {
            'Content-Type': 'application/json'
        }
        const aBici = '{"id": 10, "color": "morado", "modelo": "BMX", "lat": -34, "lng": 45}';
        request.post({
            headers: headers,
            url: 'http://localhost:3000/api/create',
            body: aBici
        },
            function(error, response, body){
                expect(response.statusCode).toBe(200);
                Bicicleta.findById(10).then(data =>{
                    expect(data.color).toBe('morado');
                });
                done();
            }
        );

    });
}); */
