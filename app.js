const express = require("express");
// let Contenedor = require("./contenedor");
let Chat = require("./chat")
const {Router} = express;
const {Server: HttpServer } = require("http");
const {Server: IOServer } = require("socket.io");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;
const router = Router();
const router2 = Router();
const handlebars = require("express-handlebars");
const faker = require("faker");
const {commerce, image} = faker;
const { schema, normalize, denormalize  } = require("normalizr");
const util = require("util");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api", router);
app.use("/api/productos-test", router2);
app.use("/static", express.static(__dirname + "/public"));

// const archivo = new Contenedor("./productos.json");
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

function products(){
    const lista = [];

    for(let i = 0; i < 5; i++){
        let obj = {
            nombre: commerce.product() ,
            precio: commerce.price(50, 200, 2, "$ "),
            foto: image.cats()
        }
        lista.push(obj);
    }

    return lista;
}


router2.get("/", async(req, res)=>{
    // let lista = await archivo.getAll();
    
    let existe = true;
    // if(lista.length > 0){
    //     existe = true;
    // }else{
    //     existe = false
    // }
    res.render("main", {
        // productos: products(),
        listaExiste: existe 
    })
})

router.get("/",async(req,res)=>{

    res.render("main",{
        listaExiste: false
    });
})





//-----------------------------------------------------------

async function traerArray(){
    let array = await mensajes.getAll();
    return array;
}

async function leer(){
    let array = await mensajes.getAll()
    console.log(JSON.stringify(array).length)
}

const schemaAuthor = new schema.Entity("author",{},{idAttribute: "email"});
const schemaMensaje = new schema.Entity("mensaje", {
    author:schemaAuthor
}, {idAttribute: "id"});

const schemaChat = new schema.Entity("chat",{
    mensajes: [schemaMensaje]
},{idAttribute: "id"});

async function chatCompleto(){
    const mensajes = await traerArray();
    const normalizrChat = normalize( {id:"chat",mensajes}, schemaChat);
    console.log(util.inspect(normalizrChat, true,12,true));
    return normalizrChat
}


//-----------------------------------------------------------




httpServer.listen(PORT, ()=>{
    console.log("Server ON in http://localhost:"+httpServer.address().port)
})
io.on("connection", async (socket)=>{
    console.log("Cliente conectado");
    // socket.emit("productos", await archivo.getAll());
    socket.emit("productos", products() );
    socket.emit("mensajes", await chatCompleto());

    // socket.on("producto-nuevo", async data =>{
    //     archivo.save(data);
    //     io.sockets.emit("productos", await archivo.getAll());
    // })

    socket.on("mensaje-nuevo", async data =>{
        mensajes.save(data);
        io.sockets.emit("mensajes", await chatCompleto());
    })
})



