const body = document.querySelector('body')
const divParticlesJS = document.getElementById('particles-js')
const url = 'http://localhost:5000/'

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
const condicionesUsuario = document.querySelectorAll('#errorRegistroUsuario h3')
const btnRegistro = document.getElementById('btnAceptarRegistro')
const condicionesClave = errorRegistroClave.querySelectorAll('h3')
const claveSecreta = document.getElementById('claveSecreta')
/*Div Repetir Clave */
const divRepetirClave = document.getElementById('divRepetirClave')
const btnCancelarRepetirClave = document.getElementById('btnCancelarRepetirClave')
const password2Registro = document.getElementById('inputContr2Registro')

const divProcesarEventos = document.getElementById('procesamientoDeEventos')

/*Variables Js */
let cantidadDeCaracteresClave = false
let cantidadDeCaracteresUsuario = false
let contieneMayusculas = false
let contieneEnteros = false
let valoresPermitidosClave = true
let valoresPermitidosUsuario = true

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

/*Cambiar entre registro e inicio*/
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

/*Validar registro*/
btnRegistro.addEventListener('click', ()=>{
    if(
        cantidadDeCaracteresClave && cantidadDeCaracteresUsuario 
        && contieneMayusculas && contieneEnteros 
        && valoresPermitidosClave && valoresPermitidosUsuario 
        && claveSecreta.value.length > 7
    ){
        divRepetirClave.style.visibility = 'visible'
        divRepetirClave.style.filter = 'opacity(100%)'
    }
})

btnCancelarRepetirClave.addEventListener('click', ()=>{
    divRepetirClave.style.filter = 'opacity(0%)'
    setTimeout(()=>{
        divRepetirClave.style.visibility = 'hidden'
    }, 600)
})

function validarClave(clave){
    const valoresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz._"    
    const resultados = [true, true, false, false]
    if(clave.length<8 || clave.length>25) resultados[0] = false
    for(const i of clave){
        if (valoresPermitidos.slice(0, 26).includes(i)) resultados[2] = true
        else if(valoresPermitidos.slice(26, 36).includes(i)) resultados[3] = true
        else if(!valoresPermitidos.slice(36, 64).includes(i)) resultados[1] = false
        if(!resultados[1] && resultados[2] && resultados[3]) return resultados
    }
    return resultados
}

function validarUsuario(usuario){
    const valoresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz._"    
    const resultados = [true, true]
    if(usuario.length<8 || usuario.length>25) resultados[0] = false
    for(const i of usuario){
        if(!valoresPermitidos.includes(i)){
            resultados[1] = false
            return resultados
        }
    }
    return resultados
}

/*Validación de clave*/
password1Registro.addEventListener('input', ()=>{
    const resultados = validarClave(password1Registro.value)
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

/*Validación de usuario*/
nombreUsuarioRegistro.addEventListener('input', ()=>{
    const resultados = validarUsuario(nombreUsuarioRegistro.value)
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

/*Inicio de sesión*/
btnInicioSes.addEventListener('click', ()=>{
    const clave = passwordInicio.value
    const resultadosClave = validarClave(clave)
    const resultadosUsuario = validarUsuario(nombreDeUsuarioInicio.value)
    let resultadoFinal = true
    for(const i of resultadosClave){
        if(!i){ resultadoFinal = false; break }
    }
    if(resultadoFinal){
        for (const i of resultadosUsuario)
            if(!i){ resultadoFinal = false; break }
    }
    if(resultadoFinal){
        iniciarSesion(nombreDeUsuarioInicio.value, clave) 
    }
    else{
        mostrarErrores('Usuario o contraseña no cumplen el formato')
    }
})

/*Registro*/
password2Registro.addEventListener('input', ()=>{
    if(password2Registro.value == password1Registro.value){
        divRepetirClave.style.filter = "opacity(0%)"
        setTimeout(()=>{
            divRepetirClave.style.visibility = 'hidden'
        }, 600)
        return registrarUsuario(nombreUsuarioRegistro.value, password1Registro.value, claveSecreta.value)
    }
})

const baseURL = 'http://localhost:5000/'

async function registrarUsuario(usuario, clave, claveSecreta){
    try{
        const respuesta = await fetch(`${baseURL}register`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ usuario, clave, claveSecreta })
        })
        const datos = await respuesta.json()
        if (!respuesta.ok){
            mostrarErrores(datos.error)
            return
        }
        divInicioSes.style.opacity = '0%'
        divRegistro.style.opacity = '0%'
        body.style.backgroundColor = 'white'
        setTimeout(()=>{
            divInicioSes.remove()
            divRegistro.remove()
            // Eliminar partículas correctamente
            const particlesContainer = document.getElementById('particles-js')
            if (particlesContainer) particlesContainer.remove()
            divProcesarEventos.style.opacity = '100%'
            divProcesarEventos.style.display = 'flex'
        }, 750)
        alert('Registro exitoso')
        solicitarEventos()
    }
    catch(error){
        console.log(error)
        mostrarErrores('Error de conexión')
    }
}

async function iniciarSesion(usuario, clave){
    try{
        const respuesta = await fetch(`${baseURL}login`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ usuario, clave })
        })
        const datos = await respuesta.json()
        if(!respuesta.ok){
            mostrarErrores(datos.error)
            return
        }
        divInicioSes.style.opacity = '0%'
        divRegistro.style.opacity = '0%'
        setTimeout(()=>{
            divInicioSes.remove()
            divRegistro.remove()
            const particlesContainer = document.getElementById('particles-js')
            if (particlesContainer) particlesContainer.remove()
            divProcesarEventos.style.opacity = '100%'
            divProcesarEventos.style.display = 'flex'
        }, 750)
        body.style.backgroundColor = 'white'
        solicitarEventos()
    }
    catch(error){
        console.log(error)
        mostrarErrores('Error de conexión')
    }
}

const divErrores = document.getElementById('divErrores')
const textoErrores = document.getElementById('textoErrores')
function mostrarErrores(error){
    textoErrores.innerText = error
    divErrores.style.opacity = "100%"
    setTimeout(()=>{
        divErrores.style.opacity = "0%"
    }, 5000)
}

/*PROCESAMIENTO DE EVENTOS*/
const divMostrarEventos = document.getElementById('divMostrarEventos')

async function solicitarEventos(){
    try{
        const respuesta = await fetch(url+'eventos')
        if (!respuesta.ok) throw new Error(`ErrorHTTP: ${respuesta.status}`)
        const datos = await respuesta.json()
        divMostrarEventos.innerHTML = ''
        let contador = 0
        for (const i of datos){
            const div = document.createElement('div')
            div.classList.add('evento')
            divMostrarEventos.append(div)

            const nombreEvento = document.createElement('h3') 
            nombreEvento.innerText = i.nombreEvento
            div.append(nombreEvento)

            const inicio = document.createElement('h3')
            inicio.innerText = `Inicio: ${i.momentoInicial.slice(0, 10)} | ${i.momentoInicial.slice(12, 19)}`
            div.append(inicio)

            const fin = document.createElement('h3')
            fin.innerText = `Fin: ${i.momentoFinal.slice(0, 10)} | ${i.momentoFinal.slice(12, 19)}`
            div.append(fin)

            const lugar = document.createElement('h3')
            lugar.innerText = i.lugar
            div.append(lugar)

            const divRecursos = document.createElement('div')
            div.append(divRecursos)
            const textoRecursos = document.createElement('h3')
            textoRecursos.innerText = 'Recursos: '
            divRecursos.append(textoRecursos)
            const lista = Object.entries(i.recursos)
            for (let [clave, valor] of lista){
                const recurso = document.createElement('h3')
                recurso.innerText = `${clave}: ${valor}`
                divRecursos.append(recurso)
            }

            const btnEliminar = document.createElement('button')
            btnEliminar.id = contador
            btnEliminar.type = 'button'
            btnEliminar.innerText = 'Eliminar'
            btnEliminar.addEventListener('click', ()=>{
                if (confirm('¿Seguro que quieres eliminar este evento?')) {
                    eliminarEvento(btnEliminar.id)
                }
            })
            div.append(btnEliminar)
            contador++
        }
    }
    catch (error){
        console.error('Error:', error)
        mostrarErrores('Error al cargar eventos')
    }
}

async function eliminarEvento(indice){
    try{
        const res = await fetch(`${url}eliminarEvento/${indice}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Falló')
        divMostrarEventos.innerHTML = ''
        solicitarEventos()
    }
    catch{
        mostrarErrores('No se pudo eliminar')
    }
}

const btnEnviarEvento = document.getElementById('btnEnviarEvento')
btnEnviarEvento.addEventListener('click', async ()=>{
    await enviarEvento()
})

function obtenerDatosEvento(){
    const nombreEvento = document.getElementById('nombreEvento').value
    const lugar = document.getElementById('lugar').value
    const momentoInicial = document.getElementById('momentoInicial').value
    const momentoFinal = document.getElementById('momentoFinal').value

    const recursos = {
        piano: document.getElementById('piano').value || 0,
        guitarra: document.getElementById('guitarra').value || 0,
        bateria: document.getElementById('bateria').value || 0,
        microfono: document.getElementById('microfono').value || 0,
        amplificador: document.getElementById('amplificador').value || 0,
        bajo: document.getElementById('bajo').value || 0,
        violin: document.getElementById('violin').value || 0,
        brea: document.getElementById('brea').value || 0,
        camara: document.getElementById('camara').value || 0
    }
    return { nombreEvento, lugar, momentoInicial, momentoFinal, recursos }
}

async function enviarEvento(){
    const datos = obtenerDatosEvento()
    try{
        const respuesta = await fetch(`${url}ingresarEvento`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
        if (!respuesta.ok){
            const errorData = await respuesta.json()
            mostrarErrores(errorData.error || 'Error al crear evento')
            return
        }
        const resultado = await respuesta.json()
        console.log(resultado.mensaje)
        divMostrarEventos.innerHTML = ''
        solicitarEventos()
    }
    catch(error){
        mostrarErrores('Error de conexión')
    }
}

/* Inicializar partículas */
particlesJS('particles-js', {
    particles: {
        number: { value: 120, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out" }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
        },
        modes: {
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
})