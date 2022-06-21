const userModel = require("../models/schemaUsers");

class MongoUser{
    constructor(){
        
    }

    async traerUsuarios(){
        try{
            let usuarios = await userModel.find({});
            return usuarios;
        }catch(err){
            console.log(err);
        }
    }

    async crearUsuario(username, password){
        try{
            let user = {
                username,
                password,
                admin: false
            }
            let documento = new userModel(user);
            let productoGuardado = await documento.save();
            return productoGuardado;
        }catch(err){
            console.log(err);
        }
    }

    async verificarUsuario(nombre){
        try{
            let user = await userModel.findOne({username:nombre});
            if(user === null){
                return false;
            }
            return user
        }catch(err){
            console.log(err);
        }
    }

}

module.exports = {MongoUser};