const {Bicicleta} = require('../../models');
const request = require('request');
const server = require('../../bin/www');

describe('Bicicletas API', () => {
    describe('GET BICICLETAS', ()=>{
        it('Status 200', ()=>{
            expect(Bicicleta.allBicis.length).toBe(0);

            const a = new Bicicleta.construct(1, 'verde', 'BMX', [6.2334221, -75.5910816]);
            Bicicleta.add(a);

            request.get('http://localhost:3000/api', function(error, response, body){
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
    });
});
