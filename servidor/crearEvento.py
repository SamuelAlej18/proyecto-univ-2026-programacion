import json
def validarEventosSolapados:
    

def crearEventoNormal(usuario, clave, nombreEvento, fechaDeInicio, horaDeInicio, horaDeFin, lugar, recursos):
    with open('datos/usuarios.json', 'r', encoding='utf-8') as jsonUsuarios:
        usuarios = json.load(jsonUsuarios)
    
    #Crear estructura evento normal:

        if usuario in usuarios and usuarios[usuario]==clave:
            with open(f'datos/eventos/{usuario}.json', 'r', encoding = 'utf-8') as archivoUsuario:
                eventosUsuario = json.load(archivoUsuario)
                if fechaDeInicio in eventosUsuario['eventosPendientes']:
                    if lugar in eventosUsuario['eventosPendientes'][fechaDeInicio]:
                        eventosUsuario['eventosPendientes'][fechaDeInicio][lugar].append({
                            "nombre" : nombreEvento,
                            "horaDeInicio" : horaDeInicio,
                            "horaDeFin": horaDeFin,
                            "recursos" : recursos,
                        })
                    else:
                        eventosUsuario['eventosPendientes'][fechaDeInicio][lugar] = [{
                            "nombre" : nombreEvento, 
                            "horaDeInicio" : horaDeInicio,
                            "horaDeFin": horaDeFin,
                            "recursos" : recursos,
                        }]
                        

                else:
                    eventosUsuario['eventosPendientes'][fechaDeInicio] = {
                        lugar :[{
                            "nombre" : nombreEvento, 
                            "horaDeInicio" : horaDeInicio,
                            "horaDeFin": horaDeFin,
                            "recursos" : recursos,
                        }]
                    }
            with open(f'datos/eventos/{usuario}.json', 'w', encoding = 'utf-8') as archivoNuevoUsuario:
                json.dump(eventosUsuario, archivoNuevoUsuario, indent=2, ensure_ascii=False)
            

