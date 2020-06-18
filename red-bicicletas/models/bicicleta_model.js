const Bicicleta = {
    construct:  function (id, color, modelo, ubicacion) {  
        this.id = id;
        this.color = color;
        this.modelo = modelo;
        this.ubicacion = ubicacion;
    },
    toString: function() {
        return `id ${this.id} | color ${this.color}`;
    },
    allBicis: [],
    add: function(aBici) {
        this.allBicis.push(aBici);
    },
    findById: async function(id_bici){
        const bici = this.allBicis.find(bicicleta => bicicleta.id == id_bici);
        if (bici)
            return bici
        else
            throw new Error(`No se encontro la bicicleta con id ${id_bici}`); 
    },
    remove: async function(id_bici){
        const find_bici = await this.findById(id_bici);
        this.allBicis.some((val, index)=>{
            if(val.id == find_bici.id){
                this.allBicis.splice(index, 1);
                return true;
            }
        })
    }
}

let a = new Bicicleta.construct('1', 'azul', 'Mountanin', [6.2334221, -75.5910816]);
let b = new Bicicleta.construct('2', 'rojo', 'Titanium', [6.2569647,-75.6286473]);

Bicicleta.add(a);
Bicicleta.add(b);

module.exports = Bicicleta;