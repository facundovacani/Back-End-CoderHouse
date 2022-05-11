const $submit = document.getElementById('enviar-producto');

const $title = document.getElementById('titulo');

const $price = document.getElementById('precio');

const $thumbnail =  document.getElementById('foto');

const $form = document.forms["formulario"];

const $span = document.querySelector("span");

const $navMenu = document.querySelector('nav');

const $tabla = document.getElementById("cuerpo");

const socket = io.connect();

const $chatForm = document.forms["chatForm"];

const $email = document.getElementById("email");

const $mensaje = document.getElementById("mensaje");

const $chat = document.getElementById("chat");


$form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(($title.value === null || $title.value === undefined || $title.value == "")){
        $span.textContent = "Por favor, rellena todos los campos";
    }else if(($price.value === null || $price.value === undefined || $price.value == "") ){
        $span.textContent = "Por favor, rellena todos los campos";

    }else if( ($thumbnail.value === null || $thumbnail.value === undefined || $thumbnail.value == "")){
        $span.textContent = "Por favor, rellena todos los campos";

    }else{
        const producto = {
            title: $title.value,
            price: $price.value,
            thumbnail: $thumbnail.value
        }
        socket.emit("producto-nuevo", producto);
        $span.textContent = `Producto ${producto.title} agregado con exito`;
        $title.value ="";
        $price.value ="";
        $thumbnail.value ="";

    }      
})

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
            email: $email.value,
            date: diaCompleto,
            mensaje: $mensaje.value
        };

        socket.emit("mensaje-nuevo", mensaje);
        $mensaje.value ="";
    }
})



async function renderTabla(data){
    const html = await data.map((item)=>{
        return(
            `<tr>
                <td>${item.title}</td>
                <td>USD ${item.price}</td>
                <td><img src="${item.thumbnail}" alt="${item.title}"> </td>
                <td><button id="${item.id}" class="boton-borrar">Borrar</button></td>
            </tr>`
        )
    }).join(" ");
    $tabla.innerHTML = html;
    const $botonesD = document.querySelectorAll(".boton-borrar");
    $botonesD.forEach(el => {
        el.addEventListener("click", (e)=>{
            console.log(e.target.id)
            let idB = e.target.id;
            socket.emit("eliminar-item", idB);
        })
    })
}

async function renderChat(data){
    const htmlChat = await data.map((mnsj)=>{
        return(
            `<div>
                <p>
                    <span>${mnsj.email}</span>
                    [<span>${mnsj.date}</span>] : 
                    <span>${mnsj.mensaje}</span>
                </p>
            </div>`
        )
    }).join(" ");
    $chat.innerHTML = htmlChat;
}
socket.on("productos", data=>{
    renderTabla(data);
})
socket.on("mensajes", data=>{
    renderChat(data);
})



window.addEventListener( "scroll" , () => {
    if(window.window.scrollY > 50){
        $navMenu.classList.add("down");

    } else if (window.window.scrollY <=50){
        $navMenu.classList.remove("down");
    };
})
