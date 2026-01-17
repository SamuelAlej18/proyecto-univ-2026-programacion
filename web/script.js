
password1Registro = document.getElementById('inputContr1Registro')
password2Registro = document.getElementById('inputContr2Registro')
aceptarRegistro = document.getElementById('button')
valoresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890._"
mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
condicionesClave = document.getElementById('errorRegistro').querySelectorAll('h3')
divInicioSes = document.getElementById('divInicioSes')
divRegistro = document.getElementById('divRegistro')

divBienvenida = document.getElementById('bienvenida')
botonesDivBienvenida= divBienvenida.querySelectorAll('button')
botonesDivBienvenida[0].addEventListener('click', ()=>{
    divBienvenida.classList.add('elementoTransparente')
    divBienvenida.remove()
    divRegistro.classList.add('elementoVisible')
})
botonesDivBienvenida[1].addEventListener('click', ()=>{
    divBienvenida.classList.add('elementoTransparente')
    divBienvenida.remove()
    divRegistro.classList.add('elementoVisible')
})

function verificarValores(valoresPermitidos, valor, n){ 
    /*n=true verifica que el valor esté*/
    if(n){
        for(const i of valor){
            if(valoresPermitidos.includes(i)){
                return console.log('el valor está')
            }
        }
    }
    else{
        for(const i of valor){
            if(!valoresPermitidos.includes(i)){
                return console.log('Se ha introducido un caracter que no está permitido')
            }
        }
    }
}

verificarValores(valoresPermitidos, ' Hola')

password1Registro.addEventListener('input', ()=>{
    const valor = password1Registro.value
    
    if(valor.length<8 || valor.length>25){
        console.log('La clave debe tener entre 8 y 25 caracteres')
    }
    verificarValores(mayusculas, valor)
    for(const i of valor){
        if(!valoresPermitidos.includes(i)){
            console.log('Se ha introducido un caracter que no es válido')
        }
    }
})
password2Registro.addEventListener('input',()=>{
    if(password1Registro.value!=password2Registro.value){
        console.log('los valores no son iguales')
        password1Registro.addEventListener('input',()=>{     
            /*Lo pongo así para que no de el error de que las claves no son iguales sin haber introducido ninguna clave */
            if(password1Registro.value!=password2Registro.value){ 
                console.log('los valores no son iguales')
            }
        })
    }
})
