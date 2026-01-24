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


function validarClave(clave, segundaClave, valoresPermitidos){
    const resultados = [true, true, false, false, false] /*0: cantidad de caracteres, 1: valores permitidos, 2: mayúscula, 3:entero, 4: claves iguales*/
    if(clave.length<8 || clave.length>25){
        resultados[0] = false
    }
    
    if (clave == segundaClave){
        resultados[4] = true
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

/*Verificar que esté bien el slice
console.log(valoresPermitidos.slice(0, 26),
valoresPermitidos.slice(26, 36),
valoresPermitidos.slice(36, 64))
*/


/*Probar que funcione correctamente la función*/
console.log(
    validarClave('A1hol...','A1hol...', valoresPermitidos), /*0: cantidad de caracteres, 1: valores permitidos, 2: mayúscula, 3:entero, 4: claves iguales*/
    validarClave('AAdsfsdn', 'AAdsfsdn', valoresPermitidos),
    validarClave('11dsfsdn', '11dsfsdno', valoresPermitidos),
    validarClave('','', valoresPermitidos),
    validarClave('A1hol ...','A1hol ...', valoresPermitidos),
    validarClave('hol','hol', valoresPermitidos),
    validarClave('1hol','hol', valoresPermitidos),
    validarClave('1hol','1hol', valoresPermitidos),
    validarClave('Ahol','Ahol', valoresPermitidos),
    validarClave('A1hol.........................................','A1hol...............................................', valoresPermitidos),
)

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

/*Probar que funcione correctamente la función
console.log(validarUsuario('88888888', valoresPermitidos))
console.log(validarUsuario('8888888', valoresPermitidos))
console.log(validarUsuario('88888888888888888888888888888888888888888888888888888888888888888', valoresPermitidos))
console.log(validarUsuario('Samu elale', valoresPermitidos))
console.log(validarUsuario('Samuelale88888', valoresPermitidos))
*/


/*Validación de registro de usuario*/
/*Validar la clave introducida*/
password1Registro.addEventListener('input', ()=>{
    const resultados = validarClave(password1Registro.value, password2Registro.value, valoresPermitidos)
    if(cantidadDeCaracteresClave && !resultados[0]){
        condicionesClave[0].style.color = 'red'
        cantidadDeCaracteresClave = false
    }
    else if(resultados[0]){
        cantidadDeCaracteresClave = true
        condicionesClave[0].style.color = 'black'
    }

    if(!resultados[1]){
        if (valoresPermitidosClave){
            condicionesClave[1].style.color = 'red'
            valoresPermitidosClave = false
        }
    }

    else if(!valoresPermitidosClave){
        condicionesClave[1].style.color = 'black'
        valoresPermitidosClave = true
    }

    if (resultados[2]){
        if (!contieneMayusculas){
            condicionesClave[2].style.color = 'black'
            contieneMayusculas = true
        }
    }
    else if(contieneMayusculas){
    condicionesClave[2].style.color = 'red'
    contieneMayusculas = false
    }

    if (resultados[3]){
        if (!contieneEnteros){
            condicionesClave[3].style.color = 'black'
            contieneEnteros = true
        }
    }
    else if(contieneEnteros){
    condicionesClave[3].style.color = 'red'
    contieneEnteros = false
    }

    if(!resultados[4]){
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
    const resultados = validarUsuario(nombreUsuarioRegistro.value, valoresPermitidos)
    if (!resultados[0]){
        if(cantidadDeCaracteresUsuario){
            cantidadDeCaracteresUsuario = false
            condicionesUsuario[1].style.color = 'red'
        }
    }
    else if(!cantidadDeCaracteresUsuario){
        cantidadDeCaracteresUsuario = true
        condicionesUsuario[1].style.color = 'black'
    }


    if (!resultados[1]){
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
    const resultadosClave = validarClave(clave, clave, valoresPermitidos)
    const resultadosUsuario = validarUsuario(nombreDeUsuarioInicio.value, valoresPermitidos)
    let resultadoFinal = true
    console.log('clave:',clave)
    console.log(resultadosClave, 'resultados clave', resultadosUsuario, 'resultados usuario')
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
    console.log('resultado final', resultadoFinal)

    if(resultadoFinal){
        console.log('realizar solicitud fetch')
    }
    else{
        console.log('usuario o contraseña incorrectos')
    }
})
