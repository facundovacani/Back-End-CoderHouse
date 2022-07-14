//inicializamos node con : node app.js --PORT 8081

const express = require("express");
const {Server: HttpServer } = require("http");
const {Server: IOServer } = require("socket.io");
const handlebars = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require('mongoose');
const procesadores = require("os").cpus().length

// let {MongoUser} = require("./src/contenedores/mongoUser");
let Contenedor = require("./src/contenedores/contenedor");
let Chat = require("./src/contenedores/chat");
let configuracion = require("./src/config/config");
// const {products} = require("./src/faker");

const router = require("./src/routes/router");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = configuracion.PORT;
// const mongoUser = new MongoUser();


const archivo = new Contenedor("./db/productos.json");
const mensajes = new Chat("./db/mensajes.json");

const MONGO_URL = configuracion.MONGO_URL;

//mongod -dbpath "rutaDBMongo"  ... Recordar para abrir la base de datos
mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}, ()=>console.log("MongoDB conectado"));


app.use(session({
    store: MongoStore.create({mongoUrl: "mongodb://localhost/sesiones"}),
    secret: "pag",
    cookie:{
        expires:600000
    },
    resave: false,
    saveUninitialized: false
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api", router);
app.use("/static", express.static(__dirname + "/public"));


app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir:__dirname + "/views/layouts",
        partialsDir:__dirname + "/views/partials/",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");

app.get("/info", (req,res)=>{
    let argumentos = process.argv.slice(2).join(" ");
    let so = process.platform;
    let node = process.version;
    let memory = process.memoryUsage();
    let pathEj = process.title;
    let processId = process.pid;
    let carpeta = process.cwd();
    res.render("info", {
        argumentos,
        so,
        node,
        memory,
        pathEj,
        processId,
        carpeta,
        procesadores
    })
});



httpServer.listen(PORT, ()=>{
    console.log("Server ON in http://localhost:"+httpServer.address().port);
})
io.on("connection", async (socket)=>{
    console.log("Cliente conectado");
    socket.emit("productos", await archivo.getAll());
    // socket.emit("productos", products() );
    socket.emit("mensajes", await mensajes.getAll());

    socket.on("producto-nuevo", async data =>{
        archivo.save(data);
        io.sockets.emit("productos", await archivo.getAll());
    });

    socket.on("mensaje-nuevo", async data =>{
        mensajes.save(data);
        io.sockets.emit("mensajes", await mensajes.getAll());
    });
})



