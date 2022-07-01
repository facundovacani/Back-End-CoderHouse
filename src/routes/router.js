const express = require("express");
const {Router} = express;
let metodos = require("./routes");

const router = Router();

const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

let bcrypts = require("../utils/bcrypts");

const userModelo = require("../models/schemaUsers");


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
router.post("/login", passport.authenticate('login', {failureRedirect : "/error-login"}), metodos.postLogin);
router.get("/error-login", metodos.getFaillogin);

router.get("/profile", metodos.getProfile);



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
router.post("/sign-in", passport.authenticate('signup',{failureRedirect : "/error-signin"}), metodos.postSignup)
router.get("/error-signin", async(req,res)=>{
    res.render("error-signin",{
        noLogged:true
    })
})

module.exports = router;