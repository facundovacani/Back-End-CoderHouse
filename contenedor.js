const fs = require("fs");

class Contenedor{
    constructor(archivo){
        this._archivo = archivo;
        if(fs.existsSync(archivo)){
            console.log("Archivo existente")
        }else{
            fs.writeFileSync(archivo , '{"productos":[]}');
        }
    }

    save(objeto){
        let data = fs.readFileSync(this._archivo, "utf-8");
        let array = JSON.parse(data).productos;
        let id;
        if(array.length === 0){
            id = 1;
        }else{
            id = array[array.length-1].id + 1;
        }
        let nuevoObjeto = {
            ...objeto,
            id : id
        };
        array.push(nuevoObjeto);
        try{            
            fs.writeFileSync(this._archivo , JSON.stringify({productos: array}, null, 2));
            console.log(`El id del objeto ${nuevoObjeto.title} es: ${nuevoObjeto.id}`);
        }catch(err){
            console.warn(err);
        }
    }

    async getById(id){
        try{
            let data = await fs.promises.readFile(this._archivo, "utf-8");
            let array = JSON.parse(data).productos;
            let bool = array.some(i => i.id == id);
            if(bool){
                let item = array.find(i => i.id == id);
                return item;
            }else{
                console.log(null);
            }
        }catch(err){
            console.warn(err)

        }
        
        
    }

    async getAll(){
        try{
            let data = await fs.promises.readFile(this._archivo, "utf-8");
            let array = JSON.parse(data).productos;
            return array;
        }catch(err){
            console.warn(err)
        }
    }

    async deleteById(id){
        try{
            let data = await fs.promises.readFile(this._archivo, "utf-8");
            let array = JSON.parse(data).productos;
            let existe = array.some((e) => e.id == id )
            if(existe){
                let item = array.findIndex(i => i.id == id);
                console.log(`Se eliminó el producto ${array[item].title} con id ${array[item].id}`)
                array.splice(item, 1);
                await fs.promises.writeFile(this._archivo , JSON.stringify({productos: array}));
        
               
            }else{
                console.log(`No existe el id ${id} en la lista de productos`)
            }

        }
        catch(err){
            console.warn(err)
        }
       
    }

    deleteAll(){
        let data = fs.readFileSync(this._archivo, "utf-8");
        let array = JSON.parse(data).productos;
        array.splice(0, array.length)
        try{            
            fs.writeFileSync(this._archivo , JSON.stringify({productos: array}));
        }catch(err){
            console.warn(err);
        } 
    }
}

module.exports = Contenedor;