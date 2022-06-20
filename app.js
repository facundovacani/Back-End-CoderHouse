const express = require("express");
const {Server: HttpServer } = require("http");
const {Server: IOServer } = require("socket.io");
const handlebars = require("express-handlebars");


const router = require("./src/routes/router1");
const router2 = require("./src/routes/router2");
let Contenedor = require("./src/models/contenedor");
let Chat = require("./src/models/chat");
// const {products} = require("./src/faker");



const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;


const archivo = new Contenedor("./db/productos.json");
const mensajes = new Chat("./db/mensajes.json");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api", router);
app.use("/api/productos-test", router2);
app.use("/static", express.static(__dirname + "/public"));



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




httpServer.listen(PORT, ()=>{
    console.log("Server ON in http://localhost:"+httpServer.address().port)
})
io.on("connection", async (socket)=>{
    console.log("Cliente conectado");
    socket.emit("productos", await archivo.getAll());
    // socket.emit("productos", products() );
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



