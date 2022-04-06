const express = require("express");
let Contenedor = require("./contenedor");
const app = express();

const PORT = 8080;

const archivo = new Contenedor("./productos.json");
archivo.save({
    title: "Heladera",
    price: 80,
    thumbnail: "https://www.nnet.com.uy/productos/imgs/heladera-james-2-puertas-c-freezer-502-litros-inox-nnet-54511-34.jpg"
})
archivo.save({
    title: "Auto",
    price: 32000,
    thumbnail: "https://elcomercio.pe/resizer/8RXQNJCo8HwHuVOJCiqYMDZSU3I=/1200x800/smart/filters:format(jpeg):quality(75)/arc-anglerfish-arc2-prod-elcomercio.s3.amazonaws.com/public/C4HT4KUZVFECDIGTAMLGVZAV34.jpg"
})

const server = app.listen(PORT, ()=>{
    console.log(`Escuchando servidor desde el puerto ${server.address().port}`);
})

server.on("error", error => console.log(`Error: ${error}`))

app.get("/productos", async (req,res)=>{
    // let html = "<h1>Productos</h1><ul style='width:50%;min-width:350px; margin: 0 auto;display:flex; flex-direction:column; justify-content:center; align-items:center;'>";
    let array = await archivo.getAll();
    // array.forEach(item => html +=`<li style='display:flex; justify-content:center; align-items:center; height:100%;min-height:140px;'>${item.title} de id ${item.id} - precio: ${item.price} <img src="${item.thumbnail}" style="width:100px; height:100px"></li>`)
    // html += "</ul>"

    res.send(array)
})

app.get("/productoRandom", async (req,res)=>{
    let array = await archivo.getAll();
    let random = parseInt(Math.random() * array.length);
    if(array.length >= random && random > 0){
        random = random; 
    }else if(random === 0){
        random = 1;
    }else{
        random = array.length;
    }
    if(await archivo.getById(random) == null){
        random = 1;
    }
    let producto = await archivo.getById(random);
    res.send(producto)
})