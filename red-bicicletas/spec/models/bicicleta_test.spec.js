const {Bicicleta} = require('../../models');

beforeEach(()=>{
    Bicicleta.allBicis = [];
});

describe('Evalua que el array inicie vacio', () => {
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
