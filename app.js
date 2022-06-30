const express = require("express");
const {Server: HttpServer } = require("http");
const {Server: IOServer } = require("socket.io");
const handlebars = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

let {MongoUser} = require("./src/contenedores/mongoUser");
let Contenedor = require("./src/contenedores/contenedor");
let Chat = require("./src/contenedores/chat");
// const {products} = require("./src/faker");
let metodos = require("./src/routes/routes");
let bcrypts = require("./src/utils/bcrypts");

const {Router} = express;
const router = Router();

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;
const mongoUser = new MongoUser();
const userModelo = require("./src/models/schemaUsers");


const archivo = new Contenedor("./db/productos.json");
const mensajes = new Chat("./db/mensajes.json");

const MONGO_URL = "mongodb://localhost/sesiones";

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

passport.use("login", new LocalStrategy(
    (username,password, callback)=>{
        userModelo.findOne({username}, (err,user)=>{
            if(err){
                return callback(err);
            }
            if(!user){
                console.log("User not found with username " + username);
                return callback(null,false);
            }
            if(!bcrypts.isValidPassword(user,password)){
                console.log("Invalid Password");
                return callback(null, false);
            }

            return callback(null,user);
        });
    }
))



passport.use("signup", new LocalStrategy(
    {passReqToCallback:true}, (req,username,password,done)=>{
        userModelo.findOne({"username":username}, function(err,user){
            if(err){
                console.log("Error in SignUp: "+ err);
                return done(err);
            }
            if(user){
                console.log("User already exists");
                return done(null,false);
            }

            console.log(req.body);

            const newUser = {
                username: username,
                password: bcrypts.createHash(password),
                admin: false             
            }
            
            console.log(newUser);

            userModelo.create(newUser, (err, userWithId)=>{
                if(err){
                    console.log("Error in Saving user: "+ err);
                    return done(err);
                }
                console.log(userWithId);
                console.log("User Registration succesful");
                return done(null, userWithId);
            });
        });
    }
))

passport.serializeUser((user,done)=>{
    done(null,user._id);
});

passport.deserializeUser((id,done)=>{
    userModelo.findById(id,done);
})





function checkAdmin(req,res,next){
    if(req.session?.logged){
        return next();
    }
    return res.render("no-logged",{noLogged:true});
}


router.get("/",checkAdmin,async(req,res)=>{

    res.render("main",{
        listaExiste: false,
        username: req.session.user
    });
})


router.get("/productos",checkAdmin, metodos.getProducts)

router.get("/login", metodos.getLogin)
router.post("/login", passport.authenticate('login'), metodos.postLogin);

router.get("/profile", metodos.getProfile);

router.get("/error-login", metodos.getProfile);


router.get("/logout", async (req,res)=>{
    let username = req.session.user;
    req.session.destroy(error =>{
        if(error){
            res.json({
                result: "error",
                error: error
            });
        }
    })

    return res.render("logout",{noLogged:true, username: username});

})
router.get("/sign-in", async(req,res)=>{
    res.render("sign-in",{
        noLogged:true
    })
})
router.post("/sign-in", passport.authenticate('signup'), metodos.postSignup)
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



