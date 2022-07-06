process.on("message", num =>{
   
    let obj = {};
    for(let i = 0; i < num; i++){
        let num = Math.floor((Math.random() * 1000) + 1);
        if(obj.hasOwnProperty(num)){
            obj[num] += 1;
        }else{
            obj[num] = 1;
        }
    }
    process.send(obj) 
    setTimeout(process.exit, 5000);   

})