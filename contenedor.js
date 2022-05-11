// const fs = require("fs");

class Contenedor{
    constructor(tabla, knex){
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
                        table.string("title").notNullable();
                        table.integer("price").notNullable();
                        table.string("thumbnail").notNullable();
                    });
                }
            });
                
        }catch(err){
            console.log(err.message, err.stack);
        }
    }

    async addProducts(producto){
        await this.knex(this.tabla).insert({
            title: producto.title,
            price: producto.price,
            thumbnail: producto.thumbnail
        }).then(result => {
            console.log(result);
        }).catch(err=>{
            console.log(err);
        })
    }

    async dropProducts(id){
        await this.knex(this.tabla).where({id:id}).del().then((result) => {
            console.log(result);
        }).catch(err => {
            console.log(err);
        });
    }

    async dropAll(){
        await this.knex(this.tabla).del().then((result)=>console.log(result))
        .catch(err => {
            console.log(err)
        });
    }

    async getProducts(){
        let data = await this.knex(this.tabla).select("title","price","thumbnail", "id")
        .then((result) => {
            let res = JSON.parse(JSON.stringify(result));
            return res;
        }).catch(err => console.log(err));        
        return data
    }

    async getProduct(id){
        let data = await this.knex(this.tabla).where({id:id}).select("title","price","thumbnail").then(result => {
            let res = JSON.parse(JSON.stringify(result));
            return res;
        })
        .catch(err => console.log(err));
        return data;
    }

    async updateProduct(id,producto){
        await this.knex(this.tabla).where({id:id}).update({
            title: producto.title,
            price: producto.price,
            thumbnail: producto.thumbnail
        }).then((result) => {
            console.log(result);
        }).catch(err => {
            console.log(err);
        })
    }
}

module.exports = Contenedor;