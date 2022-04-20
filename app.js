const express = require("express");
let Contenedor = require("./contenedor");
const {Router} = express;
const app = express();
const PORT = 8080;
const router = Router();
const handlebars = require("express-handlebars");



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api", router);
app.use(express.static("public"));

const archivo = new Contenedor("./productos.json");

app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir:__dirname + "/views/layouts",
        partialsDir:__dirname + "/views/partials/"
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");



router.get("/productos", async(req, res)=>{
    let lista = await archivo.getAll();
    let existe;
    if(lista.length > 0){
        existe = true;
    }else{
        existe = false
    }
    res.render("main", {
        productos: await archivo.getAll(),
        listaExiste: existe 
    })
})


router.get("/", async(req, res)=>{
    res.render("formProduct")
})
router.post("/productos", async(req,res)=>{
    let producto = {
        title: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail
    }
    archivo.save(producto);
    res.render("formProduct");

})


// router.get("/productos/:id", async(req,res) =>{
//     let id = req.params.id;
//     let producto = await archivo.getById(id);
//     res.json(producto);
// })



const server = app.listen(PORT, ()=>{
    console.log(`Escuchando servidor desde el puerto ${server.address().port}`);
})

server.on("error", error => console.log(`Error: ${error}`))

// app.get("/productos", async (req,res)=>{

//     let array = await archivo.getAll();

//     res.json(array)
// })

// app.get("/productoRandom", async (req,res)=>{
//     let array = await archivo.getAll();
//     let producto = array[Math.floor(Math.random() * array.length)]; // 
//     res.json(producto)
// })