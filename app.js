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

app.set("views", "./views");
app.set("view engine", "./pug");

const archivo = new Contenedor("./productos.json");


router.get("/", async(req, res)=>{
    
    res.render("form.pug")
})


router.get("/productos", async(req, res)=>{
    let lista = await archivo.getAll();
    let existe;
    if(lista.length > 0){
        existe = true;
    }else{
        existe = false
    }
    res.render("index.pug", {
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
    res.render("form.pug");

})


const server = app.listen(PORT, ()=>{
    console.log(`Escuchando servidor desde el puerto ${server.address().port}`);
})

server.on("error", error => console.log(`Error: ${error}`))
