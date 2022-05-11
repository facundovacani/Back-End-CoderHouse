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

const {knexMySql} = require("./options/knexMySql");
const {knexSqlite3} = require("./options/knexSqlite3");



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api", router);
app.use("/static", express.static(__dirname + "/public"));

const archivo = new Contenedor("productos", knexMySql);
const mensajes = new Chat("mensajes", knexSqlite3);
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

router.get("/", async (req, res)=>{
    let lista = await archivo.getProducts();

    res.render("main", {
        productos: lista
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
    let productosTodo = await archivo.getProducts()
    let mensajeTodo = await mensajes.getAll()
    socket.emit("productos", productosTodo);
    socket.emit("mensajes", mensajeTodo);
    socket.on("producto-nuevo", async data =>{
        await archivo.addProducts(data);
        let productos =  await archivo.getProducts();
        io.sockets.emit("productos", productos);
    });

    socket.on("mensaje-nuevo", async data =>{
        mensajes.save(data);
        let mensajesAll =  await mensajes.getAll();
        io.sockets.emit("mensajes",  mensajesAll);
    });

    socket.on("eliminar-item", async data =>{
        await archivo.dropProducts(data);
        let productos =  await archivo.getProducts();
        io.sockets.emit("productos",productos);
    });
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