const express = require("express");

const {Router} = express;
const router2 = Router();

router2.get("/", async(req, res)=>{
    
    let existe = true;
   
    res.render("main", {
        listaExiste: existe,
        admin:false
    })
})

module.exports = router2;