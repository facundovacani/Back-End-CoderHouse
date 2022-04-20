const express = require("express");
let Contenedor = require("./contenedor");
const {Router} = express;
const app = express();
const PORT = 8080;
const router = Router();

const archivo = new Contenedor("./productos.json");


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/static", express.static(__dirname + "/public/"));
app.use("/api", router);

// app.set("views", "./views")
app.set("view engine", "ejs")

router.get("/",async (req,res)=>{
    res.render("pages/form.ejs")
})

router.get("/productos", async(req, res)=>{
    let lista = await archivo.getAll();
    let existe;
    if(lista.length > 0){
        existe = true;
    }else{
        existe = false
    }
    res.render("pages/index", {
        productos: lista,
        listaExiste: existe 
    })
})


router.post("/productos", async(req,res)=>{
    let producto = {
        title: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail
        }
    archivo.save(producto);
    res.render("pages/form.ejs");

})

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
