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
const errorRegistroClave = document.getElementById('errorRegistroClave')
const errorRegistroUsuario = document.getElementById('errorRegistroUsuario')
const condicionesUsuario = document.querySelectorAll('h3')
const btnRegistro = document.getElementById('btnAceptarRegistro')
const condicionesClave = errorRegistroClave.querySelectorAll('h3')
const claveSecreta = document.getElementById('claveSecreta')
/*Div Repetir Clave */
const divRepetirClave = document.getElementById('divRepetirClave')
const btnCancelarRepetirClave = document.getElementById('btnCancelarRepetirClave')
const password2Registro = document.getElementById('inputContr2Registro')

/*Variables Js */
let cantidadDeCaracteresClave = false
let cantidadDeCaracteresUsuario = false
let contieneMayusculas = false
let contieneEnteros = false
let valoresPermitidosClave = true
let valoresPermitidosUsuario = true
const valoresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz._"    

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


/*Validar intento de registro: */
btnRegistro.addEventListener('click', ()=>{
    if(
        cantidadDeCaracteresClave && cantidadDeCaracteresUsuario 
        && contieneMayusculas && contieneEnteros 
        && valoresPermitidosClave && valoresPermitidosUsuario 
        &&  claveSecreta.value.length > 7
    ){
        divRepetirClave.style.visibility = 'visible'
        divRepetirClave.style.filter = 'opacity(100%)'
    }
})

/*Salir de repetir clave */
btnCancelarRepetirClave.addEventListener('click', ()=>{
    divRepetirClave.style.filter = 'opacity(0%)'
    setTimeout(()=>{divRepetirClave.style.visibility = 'hidden'
        console.log('se ejecuta')
    }, 600)
})








function validarClave(clave, valoresPermitidos){
    const resultados = [true, true, false, false] /*0: cantidad de caracteres, 1: valores permitidos, 2: mayúscula, 3:entero*/
    if(clave.length<8 || clave.length>25){
        resultados[0] = false
    }
    
    for(const i of clave){
        if (valoresPermitidos.slice(0, 26).includes(i)){
            resultados[2] = true
        }
        else if(valoresPermitidos.slice(26, 36).includes(i)){
            resultados[3] = true
        }

        else if(!valoresPermitidos.slice(36, 64).includes(i)){
            resultados[1] = false
        }
        
        if(!resultados[1] && resultados[2] && resultados[3]){ /*Para hacer que el bucle no siga si ya se tienen todos los resultados*/
            return resultados
        }
    }
    return resultados
}


function validarUsuario(usuario, valoresPermitidos){
    const resultados = [true, true] /*0: cantidad de caracteres, 1: valores permitidos */
    
    if(usuario.length<8 || usuario.length>25){
        resultados[0] = false
    }

    for(const i of usuario){
        if(!valoresPermitidos.includes(i)){
            resultados[1] = false
            return resultados
        }
    }
    return resultados
}


/*Validación de registro de usuario*/
/*Validar la clave introducida*/
password1Registro.addEventListener('input', ()=>{
    const resultados = validarClave(password1Registro.value, valoresPermitidos)
    if(cantidadDeCaracteresClave && !resultados[0]){
        condicionesClave[1].style.color = 'red'
        cantidadDeCaracteresClave = false
    }
    else if(resultados[0]){
        cantidadDeCaracteresClave = true
        condicionesClave[1].style.color = 'hsl(273, 100%, 50%)'
    }

    if(!resultados[1]){
        if (valoresPermitidosClave){
            condicionesClave[0].style.color = 'red'
            valoresPermitidosClave = false
        }
    }

    else if(!valoresPermitidosClave){
        condicionesClave[0].style.color = 'hsl(273, 100%, 50%)'
        valoresPermitidosClave = true
    }

    if (resultados[2]){
        if (!contieneMayusculas){
            condicionesClave[2].style.color = 'hsl(273, 100%, 50%)'
            contieneMayusculas = true
        }
    }
    else if(contieneMayusculas){
    condicionesClave[2].style.color = 'red'
    contieneMayusculas = false
    }

    if (resultados[3]){
        if (!contieneEnteros){
            condicionesClave[3].style.color = 'hsl(273, 100%, 50%)'
            contieneEnteros = true
        }
    }
    else if(contieneEnteros){
    condicionesClave[3].style.color = 'red'
    contieneEnteros = false
    }
})


/*Validar el usuario introducido*/
nombreUsuarioRegistro.addEventListener('input', ()=>{
    const resultados = validarUsuario(nombreUsuarioRegistro.value, valoresPermitidos)
    if (!resultados[0]){
        if(cantidadDeCaracteresUsuario){
            cantidadDeCaracteresUsuario = false
            condicionesUsuario[1].style.color = 'red'
        }
    }
    else if(!cantidadDeCaracteresUsuario){
        cantidadDeCaracteresUsuario = true
        condicionesUsuario[1].style.color = 'hsl(273, 100%, 50%)'
    }


    if (!resultados[1]){
        if(valoresPermitidosUsuario){
            valoresPermitidosUsuario = false
            condicionesUsuario[0].style.color = 'red'
        }
    }
    else if(!valoresPermitidosUsuario){
        valoresPermitidosUsuario = true
        condicionesUsuario[0].style.color = 'hsl(273, 100%, 50%)'
    }
})


/*Validación de intento de inicio de sesión*/
btnInicioSes.addEventListener('click', ()=>{
    const clave = passwordInicio.value
    const resultadosClave = validarClave(clave)
    const resultadosUsuario = validarUsuario(nombreDeUsuarioInicio.value)
    let resultadoFinal = true
    
    for(const i of resultadosClave){
        if(!i){
            resultadoFinal = false
            break
        }
    }
    
    if(resultadoFinal){
        for (const i of resultadosUsuario)
            if(!i){
                resultadoFinal = false
                break
            }
    }

    if(resultadoFinal){
        console.log('inicio de sesi')
    }
    else{
        console.log('usuario o contraseña incorrectos')
    }
})


/*Definir una solicitud fetch para recibir y enviar los datos*/

/*Solicitud de registro */
password2Registro.addEventListener('input', ()=>{
    if(password2Registro.value == password1Registro.value){
        divRepetirClave.style.filter = "opacity(0%)"
        setTimeout(()=>{
            divRepetirClave.style.visibility = 'hidden'
        }, 600)
        return console.log('se ha enviado una solicitud fetch') /************************************************************* */
    }
})


async function registrarUsuario(usuario, clave, claveSecreta){
    try{
        const respuesta = await fetch(`http://localhost:5000/registro`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                "usuario" : usuario,
                "clave" : clave, 
                "claveSecreta" : claveSecreta
            })
        })
        if (!respuesta.ok){
            /*si el servidor responde con un error intentamos obtener el mensaje*/
            const datosDelError = await respuesta.json()
            throw new Error(datosDelError.mensaje || `Error: ${respuesta.status}`)
        }

        /*Parsear la respuesta JSON*/
        const datos = await respuesta.json()
        return datos /*Falta procesar los datos**************************************************************/
    }
    catch(error){
        throw error /*Falta procesar el error*********************************************** */
    }
}
/*SolicituDeInicio */
    


/*Ejecutar el efecto de partículas */
particlesJS('particles-js', {
    particles: {
        number: {
            value: 120,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: "#ffffff"
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            }
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "repulse"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
})
