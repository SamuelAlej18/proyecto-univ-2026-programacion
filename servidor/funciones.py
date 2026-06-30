from datetime import datetime, timedelta
import os
import json

#Convertir la fecha y hora obtenidas en un objeto datetime, si no está en el formato indicado retorna None
def convertirStrDatetime(momento):
    #Formato del momento introducido desde JS: yyyy-mm-ddT-hh-mm
    #Notar que T indica dónde empieza el tiempo.
    #Nota: este método es más eficiente que datetime.strptime()
    try:
        if isinstance(momento, datetime):
            return momento
        return datetime.fromisoformat(momento)
    except (ValueError, TypeError):
        return None

def verificarSolapamiento(inicioIntervaloA, finIntervaloA, inicioIntervaloB, finIntervaloB):
    if finIntervaloA <= inicioIntervaloB or finIntervaloB <= inicioIntervaloA:
        return False
    return True

#Comprobar si un archivo existe en la base de datos:
def comprobarExistenciaArchivo(ruta): 
    return os.path.exists(ruta) and os.path.isfile(ruta)

def verificarEvento(evento):
    campos = ['nombreEvento', 'lugar', 'momentoInicial', 'momentoFinal', 'recursos', 'artistaMundial']
    for campo in campos:
        if campo not in evento or evento[campo] is None:
            return [False, f'Falta el campo "{campo}"'] #verificar que todos los campos que se requieren estén, y los lugares
    
    nombre = evento['nombreEvento']
    nombreValidado = validarNombreEvento(nombre)
    if not nombreValidado[0]:
        return [False, nombreValidado[1]]
    
    lugar = evento['lugar']
    lugares_validos = ['Anfiteatro del Bosque Plateado', 'Sala 23', 'Teatro Recuerdos', 'Cuarto del Rock']
    if lugar not in lugares_validos:
        return [False, 'El lugar no es válido']

    if not isinstance(evento['artistaMundial'], bool):
        return[False, 'Error al introducir si tiene un artista de talla mundial el evento']
    
    momentoInicial = convertirStrDatetime(evento["momentoInicial"])
    momentoFinal = convertirStrDatetime(evento["momentoFinal"])
    if momentoInicial is None or momentoFinal is None:
        return [False, 'Formato de fecha/hora incorrecto.']

    if momentoInicial >= momentoFinal:
        return [False, 'El momento inicial debe ser anterior al final']

    duracion = momentoFinal - momentoInicial
    if duracion.total_seconds() < 3600:
        return [False, 'La duración mínima es de 1 hora']
    if duracion.total_seconds() > 259200:
        return [False, 'La duración máxima es de 3 días']

    hoy = datetime.now()
    limite = hoy + timedelta(days=1)
    if momentoInicial < limite:
        return [False, "El evento debe ser avisado con 24h de antelación"]
    
    recursos = evento['recursos']
    if not recursos:
        return [False, 'El evento debe tener al menos un recurso']
    
    
    for clave, valor in recursos.items():
        try:
            valor_int = int(valor)
        except (ValueError, TypeError):
            return [False, f'El recurso "{clave}" debe ser un número entero']
        if valor_int < 0:
            return [False, f'El recurso "{clave}" no puede ser negativo']
        recursos[clave] = valor_int
    

    
    camara = recursos.get('camara', 0)
    if camara < 1:
        return [False, "Se necesita como mínimo una cámara"]
    
    brea = recursos.get('brea', 0)  #se pone(x, 0) para que en caso de que el recurso no esté ponga cero
    violin = recursos.get('violin', 0)
    if (brea > 0 and violin == 0) or (brea == 0 and violin > 0):
        return [False, 'Debes solicitar tanto brea como violín, o ningunos']
    
    guitarras = recursos.get('guitarra', 0)
    amplificadores = recursos.get('amplificador', 0)
    if guitarras == 0 and amplificadores > 0: 
        return [False, 'No se pueden solicitar amplificadores sin guitarra'] #más un amplificador por si alguno falla
    
    if guitarras > 0 and amplificadores < guitarras+1:
        return [False, 'Se necesitan la misma cantidad de amplificadores que de guitarras y dejar mínimo 1 de repuesto']
    
    piano = recursos.get('piano', 0)
    bateria = recursos.get('bateria', 0)
    if lugar == 'Sala 23' or lugar == 'Cuarto del Rock':
        if piano > 0 and bateria > 0:
            return[False, 'En este lugar no se admiten piano y batería al mismo tiempo por temas de espacio']
        elif piano != 1:
            return[False, 'En este lugar solo se admite un piano']
        elif bateria != 1:
            return [False, 'En este lugar solo se admite una batería']
    
    microfonos = recursos.get('microfono', 0) 
    cantidadInstrumentosTotales = guitarras + violin + bateria + piano + microfonos
 
    camarasNecesarias = (cantidadInstrumentosTotales+2)//3 #Se suma 2 para redondear por exceso en la división entera      
    if camara < camarasNecesarias:
        return [False, f"Se necesitan mínimo {camarasNecesarias} cámaras para estos instrumentos"]
    
    return [True]



#Realizar búsqueda binaria para encontrar la posición en la que se debe guardar un evento para mantener el orden
def vaPrimeroEnLaBD(inicioEvento, finEvento, inicioOtroEvento, finOtroEvento): #retorna un valor booleano resultado de comprobar si un elemento va antes de otro
    inicioEvento = convertirStrDatetime(inicioEvento)
    finEvento = convertirStrDatetime(finEvento)
    inicioOtro = convertirStrDatetime(inicioOtroEvento)
    finOtro = convertirStrDatetime(finOtroEvento)
    if inicioEvento != inicioOtro:
        return inicioEvento < inicioOtro
    return finEvento < finOtro

def buscarIndiceGuardar(listaEventos, indiceInicio, indiceFin, momentoInicio, momentoFin):
    if indiceInicio > indiceFin:
        return indiceInicio
    indiceMedio = (indiceInicio + indiceFin) // 2 #División entera para que no retorne un índice con coma
    inicioMedio = convertirStrDatetime(listaEventos[indiceMedio]['momentoInicial'])
    finMedio = convertirStrDatetime(listaEventos[indiceMedio]['momentoFinal'])
    if vaPrimeroEnLaBD(momentoInicio, momentoFin, inicioMedio, finMedio):
        return buscarIndiceGuardar(listaEventos, indiceInicio, indiceMedio - 1, momentoInicio, momentoFin)
    return buscarIndiceGuardar(listaEventos, indiceMedio + 1, indiceFin, momentoInicio, momentoFin)

def llamarFuncBuscarIndiceGuardar(listaDeEventos, momentoInicial, momentoFinal):
    if len(listaDeEventos) == 0:
        return 0
    return buscarIndiceGuardar(listaDeEventos, 0, len(listaDeEventos)-1, momentoInicial, momentoFinal)


#Retorna una lista de todas las posibles colisiones de un evento que se quiere crear
def obtenerColisiones(listaEventos, momentoInicial, momentoFinal):
    if not listaEventos:
        return []
    indiceInicial = 0
    indiceFinal = len(listaEventos) - 1
    ultimoInicioMenor = -1
    while indiceInicial <= indiceFinal:
        medio = (indiceInicial + indiceFinal) // 2
        if convertirStrDatetime(listaEventos[medio]['momentoInicial']) < momentoFinal:
            ultimoInicioMenor = medio
            indiceInicial = medio + 1
        else:
            indiceFinal = medio - 1
    if ultimoInicioMenor == -1:
        return []
    colisiones = []
    for i in range(ultimoInicioMenor + 1):
        evento = listaEventos[i]
        if convertirStrDatetime(evento['momentoFinal']) > momentoInicial:
            colisiones.append(evento)
    return colisiones

def verificarTotalDeRecursosPosible(recursosNecesarios, inventario):
    for clave, valor in recursosNecesarios.items():
        if clave not in inventario:
            return False
        try:
            valor_int = int(valor)
        except:
            return False
        if valor_int < 0:
            return False
        if valor_int > inventario[clave]:
            return False
    return True

def insertarPuntoOrdenado(listaPuntos, nuevoPunto):
    tiempoNuevo, tipoNuevo, recursosNuevo = nuevoPunto
    izquierda = 0
    derecha = len(listaPuntos)
    while izquierda < derecha:
        medio = (izquierda + derecha) // 2
        tiempoMedio, tipoMedio, recursosMedio = listaPuntos[medio]
        if tiempoNuevo < tiempoMedio:
            derecha = medio
        elif tiempoNuevo > tiempoMedio:
            izquierda = medio + 1
        else:
            if tipoNuevo == "fin" and tipoMedio == "inicio":
                derecha = medio
            elif tipoNuevo == "inicio" and tipoMedio == "fin":
                izquierda = medio + 1
            else:
                izquierda = medio + 1
    listaPuntos.insert(izquierda, nuevoPunto)

def calcularMayorDemandaDeRecursos(listaDeEventos, momentoInicial, momentoFinal, recursosNecesarios, inventario, lugarEvento):
    colisiones = obtenerColisiones(listaDeEventos, momentoInicial, momentoFinal)
    for i in colisiones:
        if i['lugar'] == lugarEvento:
            return False  

    colisionesDatetime = []
    for i in colisiones:
        copia = i.copy()
        copia['momentoInicial'] = convertirStrDatetime(copia['momentoInicial'])
        copia['momentoFinal'] = convertirStrDatetime(copia['momentoFinal'])
        colisionesDatetime.append(copia)

    eventos = colisionesDatetime + [{
        "momentoInicial": momentoInicial,
        "momentoFinal": momentoFinal,
        "recursos": recursosNecesarios
    }]#agregar el evento a la lista de colisiones para que también se tengan en cuenta sus recursos

    listaDePuntos = []
    for i in eventos:
        insertarPuntoOrdenado(listaDePuntos, (i["momentoInicial"], "inicio", i["recursos"]))
        insertarPuntoOrdenado(listaDePuntos, (i["momentoFinal"], "fin", i["recursos"]))

    #Notar que los puntos almacenados son tuplas que tienn el tipo de punto que son para luego procesar restando o sumando en dependencia de lo que corresponda en el barrido
    demandaActual = {}
    maximaDemanda = {}
    for tiempo, tipo, recursos in listaDePuntos:
        if tipo == "inicio":
            for clave, valor in recursos.items():
                demandaActual[clave] = demandaActual.get(clave, 0) + int(valor)
        else:  
            for clave, valor in recursos.items():
                if clave in demandaActual:
                    demandaActual[clave] -= int(valor)
        for clave, valor in demandaActual.items():
            if clave not in maximaDemanda or valor > maximaDemanda[clave]:
                maximaDemanda[clave] = valor
    #Verificar si la máxima demanda es posible
    return verificarTotalDeRecursosPosible(maximaDemanda, inventario)

def eliminarEvento(listaEventos, indice):
    if indice < 0 or indice >= len(listaEventos):
        return False
    listaEventos.pop(indice)
    return listaEventos

def verificarPosibilidadEventoFuturo(evento, inventario, listaEventos):
    resultado = verificarEvento(evento)
    if not resultado[0]:
        return [False, resultado[1]]
    recursos = evento['recursos']
    lugar = evento['lugar']
    if not verificarTotalDeRecursosPosible(recursos, inventario):
        return [False, "Recursos insuficientes incluso sin colisiones"]
    momentoInicial = convertirStrDatetime(evento['momentoInicial'])
    momentoFinal = convertirStrDatetime(evento['momentoFinal'])
    if momentoInicial is None or momentoFinal is None:
        return [False, "Fechas inválidas"]
    for i in range(1, 31):
        nuevoInicio = momentoInicial + timedelta(days=i) #Se aumenta en i días el momento inicial y final
        nuevoFin = momentoFinal + timedelta(days=i)
        colisionesDiasCompletos = obtenerColisionesDiasCompletos(nuevoInicio, nuevoFin, listaEventos)
        if calcularMayorDemandaDeRecursos(listaEventos, nuevoInicio, nuevoFin, recursos, inventario, lugar) and not verificarColisionConArtistaMundial(colisionesDiasCompletos) and not verificarEventoMismoNombreYDia(colisionesDiasCompletos, evento['nombreEvento']):
            return [True, i]
    return [False, "No se puede agendar en los próximos 30 días"]

def eliminarRecursosSobrantes(recursos): #Elimina los recursos que no van a ser utilizados en un evento.
    if not recursos:
        return {}
    nuevoDiccionario = {}
    for clave, valor in recursos.items():
        try:
            valor_int = int(valor)
        except:
            continue
        if valor_int > 0:
            nuevoDiccionario[clave] = valor_int
    return nuevoDiccionario

def obtenerColisionesDiasCompletos(momentoInicial, momentoFinal, listaEventos):
    momentoInicialConvertido = convertirStrDatetime(momentoInicial)
    momentoFinalConvertido = convertirStrDatetime(momentoFinal)
    momentoInicioPrimerDia = datetime(momentoInicialConvertido.year, momentoInicialConvertido.month, momentoInicialConvertido.day, 0, 0)
    momentoFinUltimoDia = datetime(momentoFinalConvertido.year, momentoFinalConvertido.month, momentoFinalConvertido.day, 23, 59)
    return obtenerColisiones(listaEventos, momentoInicioPrimerDia, momentoFinUltimoDia)

def verificarColisionConArtistaMundial(colisionesDiasCompletos):
    for i in colisionesDiasCompletos: #Notar que no se necesitan más parámetros
        if i["artistaMundial"] == True:
            return True
    return False
    
def verificarEventoMismoNombreYDia(colisionesDiasCompletos, nombreEvento):
    for i in colisionesDiasCompletos:
        if i['nombreEvento'] == nombreEvento:
            return True
    return False



def validarNombreEvento(nombre):
    valoresPermitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz ,' #El nombre de un evento permite el espacio pero no al principio ni al final, por eso nombre.strip()
    if not isinstance(nombre, str):
        return [False, 'el objeto no es un texto']
    nombreLimpio = nombre.strip()
    for letra in nombreLimpio:
        if letra not in valoresPermitidos:
            return [False, 'El nombre puede contener exclusivamente caracteres de la A-Z, a-z, 0-9, espacio y coma']
    
    longitudNombre = len(nombreLimpio)
    if longitudNombre>80:
        return [False, 'El nombre no puede tener más de 80 caracteres']
    elif longitudNombre<3:
        return [False, 'El nombre no puede tener menos de 3 caracteres']
    return [True]

def eliminarEventosExpirados(listaEventos): #Elimina los eventos cuya fecha de finalización sea anterior a la fecha/hora actual
    ahora = datetime.now()
    eventosActivos = []
    for evento in listaEventos:
        finEvento = convertirStrDatetime(evento.get('momentoFinal'))
        if finEvento is not None and finEvento >= ahora:
            eventosActivos.append(evento)
    return eventosActivos