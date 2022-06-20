const faker = require("faker");
const {commerce, image} = faker;


function products(){
    const lista = [];

    for(let i = 0; i < 5; i++){
        let obj = {
            title: commerce.product() ,
            price: commerce.price(50, 200, 2, "$ "),
            thumbnail: image.cats()
        }
        lista.push(obj);
    }

    return lista;
}

module.exports = {products};