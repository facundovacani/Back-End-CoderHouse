const $submit = document.querySelector('input[type="submit"]');
console.log($submit)
const $title = document.querySelector('input[type="text"]');
const $price = document.querySelector('input[type="number"]');
const $thumbnail =  document.querySelector('input[type="url"]');
const $form = document.forms["formulario"];
const $span = document.querySelector("span");
$form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(($title.value === null || $title.value === undefined || $title.value == "")){
        $span.textContent = "Por favor, rellena todos los campos";
    }else if(($price.value === null || $price.value === undefined || $price.value == "") ){
        $span.textContent = "Por favor, rellena todos los campos";

    }else if( ($thumbnail.value === null || $thumbnail.value === undefined || $thumbnail.value == "")){
        $span.textContent = "Por favor, rellena todos los campos";

    }else{
        $form.submit();
    }      
})
