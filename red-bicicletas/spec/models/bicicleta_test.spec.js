const {Bicicleta} = require('../../models');
const mongoose = require('mongoose');

describe('Testing Bicicleta', function () {
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

    describe('Bicicleta Create Instance', ()=>{
        it('Crea una instancia de bicicleta', ()=>{
            Bicicleta.createInstance(1, 'rojo', 'BMX', [-35.6, 45.8]).then(data =>{
                expect(data.code).toBe(1);
                expect(data.color).toBe('rojo');
                expect(data.modelo).toBe('BMX');
                expect(data.ubicacion[0]).toEqual(-35.6);
                expect(data.ubicacion[1]).toEqual(45.8);
            });
        });
    });

    describe('Traer todas las bicicletas', ()=>{
        it('Comienza vacia', (done)=>{
            Bicicleta.allBicis(function(error, bicis){
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe('Bicicleta Add', ()=>{
        it('Agregar una bicicleta', (done)=>{
            Bicicleta.createInstance(2, 'verde', 'Montaña', [67.8, -56.3]).then(data=>{
                let bici = data;
                Bicicleta.add(bici, function(error, newBici){
                    if(error)
                        console.log(error);
                    Bicicleta.allBicis(function(error, biciAll){
                        expect(biciAll.length).toEqual(1);
                        expect(biciAll[0].code).toEqual(bici.code);
                        done();
                    });
                });
            });
        });
    });

    describe('Bicicleta Find One', ()=>{
        it('Buscar una bicicleta', (done)=>{
            Bicicleta.allBicis(function(error, bicis){
                expect(bicis.length).toBe(0);
                const a = new Bicicleta({code: 1, color: 'verde', modelo: 'Montaña'});
                Bicicleta.add(a, function(error, bici){
                    if(error)
                        console.log(error);
                    const b = new Bicicleta({code: 1, color: 'verde', modelo: 'Montaña'});
                    Bicicleta.add(b, function(error, bici){
                        if(error)
                            console.log(error);
                        Bicicleta.findByCode(1, function (error, findBici){ 
                            expect(findBici.code).toBe(a.code);
                            expect(findBici.color).toBe(a.color);
                            expect(findBici.modelo).toBe(a.modelo);
                            done();
                        });
                    });    
                });
            });
        });
    });

    describe('Bicicleta update', ()=>{
        it('Actualizar un registro de bicicleta', (done)=>{
            Bicicleta.allBicis(function(error, bicis){
                expect(bicis.length).toBe(0);
                const a = new Bicicleta({code: 1, color: 'verde', modelo: 'Montaña'});
                Bicicleta.add(a, function(error, bici){
                    if(error)
                        console.log(error);
                    Bicicleta.findByCode(1, function(error, biciFind){
                        expect(biciFind.color).toBe(a.color);
                        expect(biciFind.modelo).toBe(a.modelo);
                        Bicicleta.update(biciFind._id, {color: 'azul'}).then(data => {
                            expect(data.color).toBe('azul');
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('Bicicleta delete', ()=>{
        it('Borrar un registro bicicleta', (done)=>{
            Bicicleta.allBicis(function(error, bicis){
                expect(bicis.length).toBe(0);
                const a = new Bicicleta({code: 1, color: 'verde', modelo: 'Montaña'}); 
                Bicicleta.add(a, function(error, bici){
                    if(error)
                        console.log(error);
                    Bicicleta.findByCode(1, function(error, biciFind){
                        if(error)
                            console.log(error);
                        expect(biciFind.color).toBe(a.color);
                        biciFind.color = 'Naranja';
                        biciFind.modelo = 'Acrobacias';
                        Bicicleta.update(biciFind._id, biciFind).then(data =>{
                            expect(data.color).toBe('Naranja');
                            expect(data.modelo).toBe('Acrobacias');
                            done();
                        });
                    });
                });
            });
        });
    })

    
});


/* describe('Evalua que el array inicie vacio', () => {
    it('Inicia vacio', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe('Agregar una bicicleta', () => {
    it('Agregar una', ()=>{
        expect(Bicicleta.allBicis.length).toBe(0);

        let a = new Bicicleta.construct('1', 'azul', 'Mountanin', [6.2334221, -75.5910816]);
        Bicicleta.add(a);

        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe('Encontrar una bicicleta por Id', ()=>{
    it('Buscar bicicleta', ()=>{
        expect(Bicicleta.allBicis.length).toBe(0);
        const a = new Bicicleta.construct(1, 'verde', 'BMX', [6.2334221, -75.5910816]);
        const b = new Bicicleta.construct(2, 'azul', 'Mountanin', [6.2334221, -75.5910816]);
        Bicicleta.add(a);
        Bicicleta.add(b);

    
        Bicicleta.findById(2).then(data => {
            expect(data.id).toBe(b.id);
            expect(data.color).toBe(b.color);
            expect(data.modelo).toBe(b.modelo);
        })
    });
});
 */