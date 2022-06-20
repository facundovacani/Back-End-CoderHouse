const express = require("express");

const {Router} = express;
const router = Router();

router.get("/",async(req,res)=>{

    res.render("main",{
        listaExiste: false
    });
})

module.exports = router


