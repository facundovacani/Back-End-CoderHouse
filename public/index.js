//constantes form de ingresar productos
const $submit = document.getElementById('enviar-producto');
const $title = document.getElementById('titulo');
const $price = document.getElementById('precio');
const $thumbnail =  document.getElementById('foto');
const $form = document.forms["formulario"];
const $span = document.querySelector("span");
//------------------------------------------

const $navMenu = document.querySelector('nav');

//Constantes de tabla de productos
const $tabla = document.getElementById("cuerpo");
const $tablaTitulo = document.getElementById("productosTitle");

const socket = io.connect();

//Constantes chat
const $chatForm = document.forms["chatForm"];
const $email = document.getElementById("email");
const $mensaje = document.getElementById("mensaje");
const $chat = document.getElementById("chat");

//constantes form ingreso usuario
const $formUser = document.forms["login-usuario"];
const $ingresar = document.getElementById("entrar");

// constantes form registro usuario
const $formRegisterUser = document.forms["registro-usuario"];
const $registrar = document.getElementById("registrar");

//const tanto para registro como ingreso
const $nombreUser = document.getElementById("username");
const $password = document.getElementById("password");
const $porError = document.getElementById("por-error");

function verificarUser(nombre,contra){
    if((nombre.value === null || nombre.value === undefined || nombre.value == "" )){
        nombre.title = "Es obligatorio poner el username";
        nombre.focus();
        return false;
    }else if((contra.value === null || contra.value === undefined || contra.value == "")){
        contra.focus();
        contra.title = "Es obligatorio poner el password";
        return false;
    }else{
        return true;
    }
}


function renderTabla(data){
    console.log(data)
    const html = data.map((item)=>{
        return(
            `<tr>
                <td>${item.title}</td>
                <td>USD ${item.price}</td>
                <td><img src="${item.thumbnail}" alt="${item.title}"> </td>  
            </tr>`
        )       
    }).join(" ");
    $tabla.innerHTML = html;
}
function renderChat(data){
    const htmlChat = data.map((mnsj)=>{
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

window.addEventListener("DOMContentLoaded", (e)=>{
    if(window.location.pathname == "/api/productos"){
        $chat.parentElement.parentElement.style.display = "none";
        socket.on("productos", data=>{
            renderTabla(data);
        })

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

    }else if(window.location.pathname == "/api/"){
        $tablaTitulo.parentElement.style.display = "none";   
        
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
     
        socket.on("mensajes", data=>{
            renderChat(data);
        })
    }else if(window.location.pathname == "/api/login"){


        $formUser.addEventListener("submit", (e)=>{
            e.preventDefault();
            if(verificarUser($nombreUser, $password)){
                fetch("http://localhost:8080/api/login",{
                    method: "POST",
                    mode: "cors",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: $nombreUser.value,
                        password: $password.value
                    })
                }).then((data)=> {
                    console.log(data);
                    if(data.status < 300 && data.status >= 200)
                    {
                        window.location.href = "http://localhost:8080/api/profile";
                    }else{
                        $porError.textContent = "Credenciales incorrectas ";
                    }
                    
                    
                })
            }else{
                $porError.textContent = "Por favor, ingrese los datos correctamente";
                
            }
        })


    }else if(window.location.pathname == "/api/sign-in"){
        $formRegisterUser.addEventListener("submit", (e)=>{
            e.preventDefault();
            if(verificarUser($nombreUser, $password)){
                fetch("http://localhost:8080/api/sign-in",{
                    method: "POST",
                    mode: "cors",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: $nombreUser.value,
                        password: $password.value
                    })
                }).then((data)=>{
                    if(data.status < 300 && data.status >= 200)
                    {
                        window.location.href = "http://localhost:8080/api/profile";
                    }else{
                        $porError.textContent = "Usuario ya existente";
                    }
                    
                })
            }
        })
    }

})



window.addEventListener( "scroll" , () => {
    if(window.window.scrollY > 20){
        $navMenu.classList.add("down");

    } else if (window.window.scrollY <=20){
        $navMenu.classList.remove("down");
    };
})
