
def verificarUsuarioIngresado(usuario, clave):
    valoresPermitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz._'

    if (len(usuario)<8 or len(usuario)>25):
        return False

    for i in usuario:
        if i not in valoresPermitidos:
            return False
    
    if (len(clave)<8 or len(clave)>25): 
        return False
    
    mayuscula = False
    entero = False
    
    for i in clave:
        if i in valoresPermitidos[0:26]:
            mayuscula = True

        elif i in valoresPermitidos[26:36]:
            entero = True
        
        elif i not in valoresPermitidos[36:]:
            return False
    if not mayuscula or not entero:
        return False
    return True


import json

def crearUsuario(usuario, clave, claveSecreta, usuarios):
    if verificarUsuarioIngresado(usuario, clave) and claveSecreta == 'El concierto': #<-- clave secreta aquí************************************

        if usuario not in usuarios:
            usuarios[usuario] = clave
            return [True, usuarios]
        else:
            return [False, 'Este usuario ya existe']
    return [False, 'el usuario ingresado no es válido o alguna de las claves']
    

def inicioSes(usuario, clave, listaUsuarios):
    if usuario in listaUsuarios:
        if listaUsuarios[usuario] == clave:
            return [True]
    return [False, 'usuario o claves incorrectas']
