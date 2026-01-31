
def verificarUsuarioIngresado(usuario, clave):
    valoresPermitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz._'
    #verificando que estén correctos los índices de los valores permitidos, recordar que son exclusivos
    #print (valoresPermitidos[0], valoresPermitidos[25], valoresPermitidos[26], valoresPermitidos[35], valoresPermitidos[36], valoresPermitidos[0:26])

    #verificar usuario
    if (len(usuario)<8 or len(usuario)>25):
        return False

    for i in usuario:
        if i not in valoresPermitidos:
            return False
    
    #verificarClave
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


print('prueba', verificarUsuarioIngresado("samuelalejandrov","SSS11111" ))
'''
print(verificarUsuarioIngresado('holamundo', 'S1234567', valoresPermitidos),
    verificarUsuarioIngresado('holamund o', 'S1234567', valoresPermitidos),#caracter no permitido en el nombre
    verificarUsuarioIngresado('holamundo', 's1234567', valoresPermitidos),#sin mayuscula
    verificarUsuarioIngresado('holamundo', 's123456 7', valoresPermitidos),#caracter no permitido clave
    verificarUsuarioIngresado('holamundo', 'samuelAlejan', valoresPermitidos),#sin int
    verificarUsuarioIngresado('ho', 'S1234567', valoresPermitidos),#menos caracteres
    verificarUsuarioIngresado('holamundo', 'S123456', valoresPermitidos),#menos caracteres
    verificarUsuarioIngresado('holamundo000000000000000000000000000000000000000000', 'S1234567', valoresPermitidos),#más caracteres
    verificarUsuarioIngresado('holamundo', 'S12345670000000000000000000000000000000000000000000000000000', valoresPermitidos) #más caracteres
)
'''


import json

def crearUsuario(usuario, clave, claveSecreta):
    if verificarUsuarioIngresado(usuario, clave) and claveSecreta == 'El concierto': #<-- clave secreta aquí
        with open('datos/usuarios.json', 'r', encoding='utf-8') as jsonUsuarios:
            usuarios = json.load(jsonUsuarios)
        
        if usuario not in usuarios:
            usuarios[usuario] = clave
            with open('datos/usuarios.json', 'w', encoding = 'utf-8') as jsonNuevoUsuarios:
                json.dump(usuarios, jsonNuevoUsuarios, indent = 4)
            

            print(f'El usuario {usuario} ha sido creado exitosamente')
        else:
            return print('El usuario ya existe')#**************************************
    else:
        return print('el usuario ingresado no es válido') #*************************************************************
    
crearUsuario('amirkalvera', 'A1973642aa')
