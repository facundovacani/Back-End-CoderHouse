const express = require("express");
const {Server: HttpServer } = require("http");
const {Server: IOServer } = require("socket.io");
const handlebars = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require('mongoose');

let {MongoUser} = require("./src/contenedores/mongoUser");
let Contenedor = require("./src/contenedores/contenedor");
let Chat = require("./src/contenedores/chat");
// const {products} = require("./src/faker");

const {Router} = express;
const router = Router();

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;
const MONGO_URL = "mongodb://localhost/sesiones";
const mongoUser = new MongoUser();


mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}, ()=>console.log("MongoDB conectado"));

const archivo = new Contenedor("./db/productos.json");
const mensajes = new Chat("./db/mensajes.json");

app.use(session({
    store: MongoStore.create({mongoUrl: "mongodb://localhost/sesiones"}),
    secret: "pag",
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
        partialsDir:__dirname + "/views/partials/"
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");

function checkAdmin(req,res,next){
    if(req.session?.logged){
        return next();
    }
    return res.render("no-logged",{noLogged:true});
}


router.get("/",checkAdmin,async(req,res)=>{

    res.render("main",{
        listaExiste: false
    });
})


router.get("/productos",checkAdmin, async(req,res)=>{
    let existe = true;
    if(req.session?.admin){
        res.render("main",{
            listaExiste: existe,
            admin: true
        });
    }else{
        res.render("main",{
            listaExiste: existe,
            admin: false
        });
    }
})

router.get("/login", async ( req , res)=>{
    res.render("login",{
        noLogged:true
    })
})
router.post("/login", async (req,res)=>{
    const {username, password} = req.body;
    let usuario = await mongoUser.verificarUsuario(username);
    if(usuario !== false){   
        if(password == usuario.password){
            req.session.user = usuario.username;
            req.session.admin = usuario.admin;
            req.session.logged = true;            
            res.json({
                result: "Correcto",
                usuario
            });
        }else{
            res.json({result:"Contraseña incorrecta"})
        }
    }else{
        res.json({
            result: "Usuario incorrecto"
        });
    }
})

router.get("/logout", async (req,res)=>{
    req.session.destroy(error =>{
        if(error){
            res.json({
                result: "error",
                error: error
            });
        }
    })

    res.render("login",{
        noLogged:true
    })
})
router.get("/sign-in", async(req,res)=>{
    res.render("sign-in",{
        noLogged:true
    })
})
// router.post("/sign-in", async (req,res)=>{

// })
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



