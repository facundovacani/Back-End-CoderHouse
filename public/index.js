
const $submit = document.getElementById('enviar-producto');

// const $title = document.getElementById('titulo');

// const $price = document.getElementById('precio');

// const $thumbnail =  document.getElementById('foto');

// const $form = document.forms["formulario"];

// const $span = document.querySelector("span");

const $navMenu = document.querySelector('nav');

const $tabla = document.getElementById("cuerpo");

const $tablaTitulo = document.getElementById("productosTitle");

const socket = io.connect();

const $chatForm = document.forms["chatForm"];

const $email = document.getElementById("email");

const $mensaje = document.getElementById("mensaje");

const $chat = document.getElementById("chat");

// $form.addEventListener("submit", (e)=>{
//     e.preventDefault();
//     if(($title.value === null || $title.value === undefined || $title.value == "")){
//         $span.textContent = "Por favor, rellena todos los campos";
//     }else if(($price.value === null || $price.value === undefined || $price.value == "") ){
//         $span.textContent = "Por favor, rellena todos los campos";

//     }else if( ($thumbnail.value === null || $thumbnail.value === undefined || $thumbnail.value == "")){
//         $span.textContent = "Por favor, rellena todos los campos";

//     }else{
//         const producto = {
//             title: $title.value,
//             price: $price.value,
//             thumbnail: $thumbnail.value
//         }
//         socket.emit("producto-nuevo", producto);
//         $span.textContent = `Producto ${producto.title} agregado con exito`;
//         $title.value ="";
//         $price.value ="";
//         $thumbnail.value ="";

//     }      
// })

$chatForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(($email.value === null || $email.value === undefined || $email.value == "" )){
        $email.title = "Es obligatorio poner el email";
        $email.focus();
    }else if(($mensaje.value === null || $mensaje.value === undefined || $mensaje.value == "")){
        $mensaje.focus();
        $mensaje.title = "Es obligatorio poner el mensaje";
    }else{
        let fecha = new Date();
        let dia = fecha.getDate();
        let mes = fecha.getMonth();
        let year = fecha.getFullYear();
        let hora = fecha.getHours();
        let minutos = fecha.getMinutes();
        let segundos = fecha.getSeconds();
        let diaCompleto = `${dia}/${mes}/${year} ${hora}:${minutos}:${segundos}`;
        const mensaje = {
            author: {
                email: $email.value,
                date: diaCompleto
            },
            text: $mensaje.value           
          
        };

        socket.emit("mensaje-nuevo", mensaje);
        $mensaje.value ="";
    }
})


//desnormalizando
const schemaAuthor = new normalizr.schema.Entity("author",{},{idAttribute: "email"});
const schemaMensaje = new normalizr.schema.Entity("mensaje", {
    author:schemaAuthor
}, {idAttribute: "id"});

const schemaChat = new normalizr.schema.Entity("chat",{
    mensajes: [schemaMensaje]
},{idAttribute: "id"});


function renderTabla(data){
    console.log(data)
    const html = data.map((item)=>{
        // return(
        //     `<tr>
        //         <td>${item.title}</td>
        //         <td>USD ${item.price}</td>
        //         <td><img src="${item.thumbnail}" alt="${item.title}"> </td>  
        //     </tr>`
        // )
        return(
            `<tr>
                <td>${item.nombre}</td>
                <td>USD ${item.precio}</td>
                <td><img src="${item.foto}" alt="${item.nombre}"> </td>  
            </tr>`
        )
    }).join(" ");
    $tabla.innerHTML = html;
}
function renderChat(data){
    const htmlChat = data.mensajes.map((mnsj)=>{
        return(
            `<div>
                <p>
                    <span>${mnsj.author.email}</span>
                    [<span>${mnsj.author.date}</span>] : 
                    <span>${mnsj.text}</span>
                </p>
            </div>`
        )
    }).join(" ");
    $chat.innerHTML = htmlChat;
}
if(window.location.pathname == "/api/productos-test"){
    socket.on("productos", data=>{
        renderTabla(data);
    })
    $chat.parentElement.parentElement.style.display = "none";
}else{
    socket.on("mensajes", data=>{
        let mensajesPeso = JSON.stringify(data).length;
        let mensajes = normalizr.denormalize(data.result, schemaChat, data.entities);
        console.log(mensajesPeso)
        let mensajesDPeso = JSON.stringify(mensajes).length;
        console.log(mensajesDPeso)
        let porcentaje = parseInt((mensajesPeso*100)/mensajesDPeso);
        let h3 = document.createElement("h3");
        h3.textContent = porcentaje + " %";
        let progress = document.createElement("progress");
        progress.setAttribute("value", porcentaje);
        progress.setAttribute("max", 100);
        let article = $chat.parentElement;
        article.insertBefore(h3, $chat);
        article.insertBefore(progress, $chat);
        renderChat(mensajes);
    })
    $tablaTitulo.parentElement.style.display = "none";
    
}



window.addEventListener( "scroll" , () => {
    if(window.window.scrollY > 50){
        $navMenu.classList.add("down");

    } else if (window.window.scrollY <=50){
        $navMenu.classList.remove("down");
    };
})
