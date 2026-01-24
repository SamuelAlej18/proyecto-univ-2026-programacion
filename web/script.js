/*Div bienvenida */
const divBienvenida = document.getElementById('bienvenida')
const botonesDivBienvenida = divBienvenida.querySelectorAll('button')

/*Div Inicio de Sesión */
const divInicioSes = document.getElementById('divInicioSes')
const btnCambiarInicioRegistro = document.getElementById('btnCambiarInicioRegistro')
const nombreDeUsuarioInicio = document.getElementById('inputNombreUsuarioInicSes')
const passwordInicio = document.getElementById('inputContrInicSes')
const btnInicioSes = document.getElementById('btnIniciar')

/*Div de Registro */
const divRegistro = document.getElementById('divRegistro')
const btnCambiarRegistroInicio = document.getElementById('btnCambiarRegistroInicio')
const nombreUsuarioRegistro = document.getElementById('inputNombreUsuarioRegistro')
const password1Registro = document.getElementById('inputContr1Registro')
const password2Registro = document.getElementById('inputContr2Registro')
const errorRegistroClave = document.getElementById('errorRegistroClave')
const errorRegistroUsuario = document.getElementById('errorRegistroUsuario')
const condicionesUsuario = document.querySelectorAll('h3')
const btnRegistro = document.getElementById('btnAceptarRegistro')
const condicionesClave = errorRegistroClave.querySelectorAll('h3')

/*Variables Js */
let cantidadDeCaracteresClave = false
let cantidadDeCaracteresUsuario = false
let contieneMayusculas = false
let contieneEnteros = false
let valoresPermitidosClave = true
let valoresPermitidosUsuario = true
let clavesIguales = true
const valoresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890._"
const mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const enteros = "1234567890"

/*Funcionalidades botones div bienvenida*/
botonesDivBienvenida[0].addEventListener('click', ()=>{
    divBienvenida.classList.add('elementoTransparente')
    divBienvenida.remove()
    divInicioSes.classList.add('elementoVisible')
})
botonesDivBienvenida[1].addEventListener('click', ()=>{
    divBienvenida.remove()
    divRegistro.classList.add('elementoVisible')
})

/*Cambiar entre la pantalla de registro y la de inicio de sesión */
btnCambiarInicioRegistro.addEventListener('click', ()=>{
    divRegistro.classList.add('elementoVisible')
    divRegistro.classList.remove('elementoTransparente')
    divInicioSes.classList.add('elementoTransparente')
    divInicioSes.classList.remove('elementoVisible')
})

btnCambiarRegistroInicio.addEventListener('click', ()=>{
    divRegistro.classList.add('elementoTransparente')
    divRegistro.classList.remove('elementoVisible')
    divInicioSes.classList.add('elementoVisible')
    divInicioSes.classList.remove('elementoTransparente')
})

/*Definiendo una función que le pasas unos valores y un str y te devuelve si el str tiene o no los valores */
function verificarValores(valoresPermitidos, valor, n){ 
    /*n=true Verifica un valor esté*/
    if(n){
        for(const i of valor){
            if(valoresPermitidos.includes(i)){
                return true
            }
        }
        return false
    }
    /*n = false Verifica que todos los valores estén */

    for(const i of valor){
        if(!valoresPermitidos.includes(i)){
            return false
        }
    }
    return true
}

/*Validación de registro de usuario*/
/*Validar la clave introducida*/
password1Registro.addEventListener('input', ()=>{
    const valor = password1Registro.value

    if(cantidadDeCaracteresClave&&(valor.length<8 || valor.length>25) ){
        condicionesClave[0].style.color = 'red'
        cantidadDeCaracteresClave = false
    }
    else if(valor.length<=25 && valor.length>=8){
        cantidadDeCaracteresClave = true
        condicionesClave[0].style.color = 'black'
    }

    if(!verificarValores(valoresPermitidos, valor, false)){
        if (valoresPermitidosClave){
            condicionesClave[1].style.color = 'red'
            valoresPermitidosClave = false
        }
        /*No se usa un and para que no haga nada si la variable está en falso */      
    }
    else if(!valoresPermitidosClave){
        condicionesClave[1].style.color = 'black'
        valoresPermitidosClave = true
    }

    if (verificarValores(mayusculas, valor, true)){
        if (!contieneMayusculas){
            condicionesClave[2].style.color = 'black'
            contieneMayusculas = true
        }
    }
    else if(contieneMayusculas){
    condicionesClave[2].style.color = 'red'
    contieneMayusculas = false
    }

    if (verificarValores(enteros, valor, true)){
        if (!contieneEnteros){
            condicionesClave[3].style.color = 'black'
            contieneEnteros = true
        }
    }
    else if(contieneEnteros){
    condicionesClave[3].style.color = 'red'
    contieneEnteros = false
    }

    if(valor!=password2Registro.value){
        if(clavesIguales){
            condicionesClave[4].style.color = 'red'
            clavesIguales = false
        }
    }
    else if(!clavesIguales){
        condicionesClave[4].style.color = 'black'
        clavesIguales = true
    }
})
password2Registro.addEventListener('input',()=>{
    if(password1Registro.value!=password2Registro.value){
        if(clavesIguales){
            condicionesClave[4].style.color = 'red'
            clavesIguales = false
        }
    }
    else if(!clavesIguales){
        condicionesClave[4].style.color = 'black'
        clavesIguales = true
    }
})
/*Validar el usuario introducido*/
nombreUsuarioRegistro.addEventListener('input', ()=>{
    const valor = nombreUsuarioRegistro.value
    if (valor.length<8 || valor.length>25){
        if(cantidadDeCaracteresUsuario){
            cantidadDeCaracteresUsuario = false
            condicionesUsuario[1].style.color = 'red'
        }
    }
    else if(!cantidadDeCaracteresUsuario){
        cantidadDeCaracteresUsuario = true
        condicionesUsuario[1].style.color = 'black'
    }


    if (!verificarValores(valoresPermitidos, valor, false)){
        if(valoresPermitidosUsuario){
            valoresPermitidosUsuario = false
            condicionesUsuario[0].style.color = 'red'
        }
    }
    else if(!valoresPermitidosUsuario){
        valoresPermitidosUsuario = true
        condicionesUsuario[0].style.color = 'black'
    }
})


/*Validación de intento de inicio de sesión*/
btnInicioSes.addEventListener('click', ()=>{
    const clave = passwordInicio.value
    const usuario = nombreDeUsuarioInicio.value
    if(
        verificarValores(valoresPermitidos, clave, false)&&
        verificarValores(mayusculas, clave, true)&&
        verificarValores(enteros, clave, true)&&
        clave.length<=25 && clave.length>=8 &&
        verificarValores(valoresPermitidos, usuario, false)&&
        usuario.length<=25 && usuario.length>=8
    ){
        console.log('solicitud fetch')
    }
    else{
        console.log('usuario o contraseña inválidos')
    }
})

/*Nota: el nombre de usuario va a poder tener de 5 a 25 caracteres, los mismos valores permitidos, no importa lo de la mayúscula ni el entero.*/