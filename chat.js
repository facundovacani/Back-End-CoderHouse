
class Chat{
    constructor(tabla,knex){
        this.tabla = tabla;   
        this.knex = knex;
        this.createTable();
    }
    async createTable(){
        
        try{

            await this.knex.schema.hasTable(this.tabla).then(exist =>{
                if(!exist){
                    return this.knex.schema.createTable(this.tabla, table=>{
                        table.increments("id").primary().notNullable();
                        table.string("email").notNullable();
                        table.string("mensaje").notNullable();
                        table.string("date").notNullable();
                    });
                }
            });
        
                
        }catch(err){
            console.log(err.message, err.stack);
        }
    }

    
    async save(mensajes){
        await this.knex(this.tabla).insert({
            email: mensajes.email,
            date: mensajes.date,
            mensaje: mensajes.mensaje
        }).then(result => {
            console.log(result);
        }).catch(err=>{
            console.log(err);
        })
    }


    async getAll(){
        let data = await this.knex(this.tabla).select("email","mensaje","date")
        .then((result) => {
            let res = JSON.parse(JSON.stringify(result));
            return res;
        }).catch(err => console.log(err));        
        return data;
    }
}

module.exports = Chat;


/* 


    save(objeto){
        try{            
            let data = fs.readFileSync(this._archivo, "utf-8");
            let array = JSON.parse(data).mensajes;
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
            fs.writeFileSync(this._archivo , JSON.stringify({mensajes: array}, null, 2));
            return nuevoObjeto.id;
        }catch(err){
            console.warn(err);
        }
    }
    
    async getById(id){
        try{
            let data = await fs.promises.readFile(this._archivo, "utf-8");
            let array = JSON.parse(data).mensajes;
            let bool = array.some(i => i.id == id);
            if(bool){
                let item = array.find(i => i.id == id);
                return item;
            }else{
                return { error : 'mensaje no encontrado' }
            }
        }catch(err){
            console.warn(err)

        }
        
        
    }

    async getAll(){
        try{
            let data = await fs.promises.readFile(this._archivo, "utf-8");
            let array = JSON.parse(data).mensajes;
            return array;
        }catch(err){
            console.warn(err)
        }
    }

    async deleteById(id){
        try{
            let data = await fs.promises.readFile(this._archivo, "utf-8");
            let array = JSON.parse(data).mensajes;
            let existe = array.some((e) => e.id == id )
            if(existe){
                let item = array.findIndex(i => i.id == id);
                console.log(`Se eliminó el mensaje ${array[item].title} con id ${array[item].id}`)
                array.splice(item, 1);
                await fs.promises.writeFile(this._archivo , JSON.stringify({mensajes: array}));  
                return ({result:"mensaje Eliminado"});             
            }else{
                return({ error : 'mensaje no encontrado' })
            }

        }
        catch(err){
            console.warn(err)
        }
       
    }

    deleteAll(){
        let data = fs.readFileSync(this._archivo, "utf-8");
        let array = JSON.parse(data).mensajes;
        array.splice(0, array.length)
        try{            
            fs.writeFileSync(this._archivo , JSON.stringify({mensajes: array}));
        }catch(err){
            console.warn(err);
        } 
    }
*/