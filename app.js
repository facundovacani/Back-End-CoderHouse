const express = require("express");
let Contenedor = require("./contenedor");
let Chat = require("./chat")
const {Router} = express;
const {Server: HttpServer } = require("http");
const {Server: IOServer } = require("socket.io");


const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;
const router = Router();
const handlebars = require("express-handlebars");



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api", router);
app.use("/static", express.static(__dirname + "/public"));

const archivo = new Contenedor("./productos.json");
const mensajes = new Chat("./mensajes.json");
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



router.get("/", async(req, res)=>{
    let lista = await archivo.getAll();
    let existe;
    if(lista.length > 0){
        existe = true;
    }else{
        existe = false
    }
    res.render("main", {
        productos: lista,
        listaExiste: existe 
    })
})

// router.post("/", async(req,res)=>{
//     let producto = {
//         title: req.body.title,
//         price: req.body.price,
//         thumbnail: req.body.thumbnail
//     }
//     archivo.save(producto);
//     res.render("main", {
//         productos: await archivo.getAll(),
//         listaExiste: true 
//     });

// })


// router.get("/productos/:id", async(req,res) =>{
//     let id = req.params.id;
//     let producto = await archivo.getById(id);
//     res.json(producto);
// })



httpServer.listen(PORT, ()=>{
    console.log("Server ON in http://localhost:"+httpServer.address().port)
})

io.on("connection", async (socket)=>{
    console.log("Cliente conectado");
    socket.emit("productos", await archivo.getAll());
    socket.emit("mensajes", await mensajes.getAll());

    socket.on("producto-nuevo", async data =>{
        archivo.save(data);
        io.sockets.emit("productos", await archivo.getAll());
    })

    socket.on("mensaje-nuevo", async data =>{
        mensajes.save(data);
        io.sockets.emit("mensajes", await mensajes.getAll());
    })
})

// app.get("/productos", async (req,res)=>{

//     let array = await archivo.getAll();

//     res.json(array)
// })

// app.get("/productoRandom", async (req,res)=>{
//     let array = await archivo.getAll();
//     let producto = array[Math.floor(Math.random() * array.length)]; // 
//     res.json(producto)
// })