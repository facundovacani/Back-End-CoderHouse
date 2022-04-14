const express = require("express");
let Contenedor = require("./contenedor");
const {Router} = express;
const app = express();
const PORT = 8080;
const router = Router();



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/static", express.static(__dirname + "/public"));
app.use("/api", router);


app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/public/index.html")
})
router.get("/productos",async (req,res)=>{
    let array = await archivo.getAll();
    res.json(array)
})
router.get("/productos/:id", async(req,res) =>{
    let id = req.params.id;
    let producto = await archivo.getById(id);
    res.json(producto);
})
router.post("/productos", async(req,res)=>{
    let producto = {
        title: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail
        }
    let productoId = archivo.save(producto);
    let lista = await archivo.getAll();
    console.log(productoId); // Agregue esto, ya que mostraría el mensaje del return del método save. Para que en la consola notifique el ide del nuevo producto.
    let productoFinal = lista[lista.length-1]
    res.json(productoFinal);

})
router.put("/productos/:id", async(req,res)=>{
    let id = req.params.id;
    let precio = req.body.precio;
    let producto = await archivo.putById(id,precio);
    res.json(producto)

})
router.delete("/productos/:id", async(req,res)=>{
    let id = req.params.id;
    let eliminado = await archivo.deleteById(id);
    res.json(eliminado);

})
const archivo = new Contenedor("./productos.json");
// archivo.save({
//     title: "Heladera",
//     price: 80,
//     thumbnail: "https://www.nnet.com.uy/productos/imgs/heladera-james-2-puertas-c-freezer-502-litros-inox-nnet-54511-34.jpg"
// })
// archivo.save({
//     title: "Auto",
//     price: 32000,
//     thumbnail: "https://elcomercio.pe/resizer/8RXQNJCo8HwHuVOJCiqYMDZSU3I=/1200x800/smart/filters:format(jpeg):quality(75)/arc-anglerfish-arc2-prod-elcomercio.s3.amazonaws.com/public/C4HT4KUZVFECDIGTAMLGVZAV34.jpg"
// })

const server = app.listen(PORT, ()=>{
    console.log(`Escuchando servidor desde el puerto ${server.address().port}`);
})

server.on("error", error => console.log(`Error: ${error}`))

app.get("/productos", async (req,res)=>{
    // let html = "<h1>Productos</h1><ul style='width:50%;min-width:350px; margin: 0 auto;display:flex; flex-direction:column; justify-content:center; align-items:center;'>";
    let array = await archivo.getAll();
    // array.forEach(item => html +=`<li style='display:flex; justify-content:center; align-items:center; height:100%;min-height:140px;'>${item.title} de id ${item.id} - precio: ${item.price} <img src="${item.thumbnail}" style="width:100px; height:100px"></li>`)
    // html += "</ul>"

    res.json(array)
})

app.get("/productoRandom", async (req,res)=>{
    let array = await archivo.getAll();
    let producto = array[Math.floor(Math.random() * array.length)]; // Metodo de pamela, mucho más efectivo.
    // let random = parseInt(Math.random() * array.length);
    // if(array.length >= random && random > 0){
    //     random = random; 
    // }else if(random === 0){
    //     random = 1;
    // }else{
    //     random = array.length;
    // }
    // if(await archivo.getById(random) == null){
    //     random = 1;
    // }
    // let producto = await archivo.getById(random);
    res.json(producto)
})