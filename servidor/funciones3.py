from datetime import datetime, timedelta
import os
import json
#Convertir la fecha y hora obtenidas en un objeto datetime, si no está en el formato indicado retorna False
def convertirStrDatetime(momento):
    #Formato del momento introducido desde JS: yyyy-mm-ddT-hh-mm
    #Notar que T indica dónde empieza el tiempo.
    #Nota: este método es más eficiente que datetime.strptime()
    try:
        momentoConvertido = datetime.fromisoformat(momento)
        return momentoConvertido
    except ValueError:
        return False 


#Probar que funcione:
#print(convertirStrDatetime('2026-02-21T10:34'))
#print(convertirStrDatetime('2026-02-21T10: 34'))


#Verificar que dos intervalos se solapen, False = sin solapamiento, NO es solapamiento si el fin de uno es exactamente el mismo inicio del otro
def verificarSolapamiento(inicioIntervaloA, finIntervaloA, inicioIntervaloB, finIntervaloB):
    if finIntervaloA <= inicioIntervaloB or finIntervaloB <= inicioIntervaloA:
        return False 
    return True

#Probar que funcione:
#iA = [convertirStrDatetime('2026-02-10T10:36'), convertirStrDatetime('2026-02-10T14:36')]
#iB = [convertirStrDatetime('2026-02-10T14:36'), convertirStrDatetime('2026-02-10T18:36')]
#iC = [convertirStrDatetime('2026-02-10T05:30'), convertirStrDatetime('2026-02-10T14:36')]
#print(verificarSolapamiento(iA[0],iA[1], iA[0], iA[1]))


#Comprobar si el archivo de la fecha existe en los datos:
def comprobarExistenciaArchivo(ruta):
    if os.path.exists(ruta) and os.path.isfile(ruta): #Nota: os.path.isfile comprueba que sea un archivo y no una carpeta el archivo
        return True
    return False




#Prueba
#print(comprobarExistenciaArchivoRecuros('ejemplo.json'))
#print(comprobarExistenciaArchivoRecuros('ejemplo2.json'))


#Almacenar evento verificado:
#Notas: el evento es un objeto de evento, VERIFICADO PREVIAMENTE, la fecha un str
def almacenarEvento(evento, fecha):
    ruta = f'datos/recursos/{fecha}.json'
    existeArchivo = comprobarExistenciaArchivo(ruta)
    if not existeArchivo:
        with open(ruta, 'w', encoding ='utf-8') as archivo:
            json.dump(evento, archivo, indent = 2, ensure_ascii= False)
            print('archivo guardado exitosamente, procesar aquí')
    else:
        with open(ruta, "r", encoding = "utf-8") as archivo:
            recursosFecha = json.load(archivo)

        #búsqueda binaria para encontrar la posición del evento en 


#Prueba

almacenarEvento({"nombre" : "felipe"}, '10demao')


def verificarEvento(evento): #Retorna [True] si está correcto el evento o [False, 'Error que contiene el evento']
    momentoInicial = convertirStrDatetime(evento["momentoInicial"])
    momentoFinal = convertirStrDatetime(evento["momentoFinal"])
    
    #Verificar que la fecha de inicio sea menor que la de fin
    if (momentoInicial > momentoFinal):
        return[False, 'El momento inical no puede ser después que el momento final']
    
    #Verificar que el evento tenga una duración mínima de 1 hora
    duracion = momentoFinal - momentoInicial
    if duracion.total_seconds() < 3600:
        return [False, 'El evento no cumple el tiempo mínimo de una hora']
    elif duracion.total_seconds() > 259200:
        return [False, 'El evento no cumple el máximo de 3 días']
    #Verificar que contenga nombre el evento, con los requisitos necesarios:
    if not 'nombreEvento' in evento: 
        return [False, 'El evento no tiene nombre']
    





#Realizar búsqueda binaria en un array de objetos para encontrar la posición en la que se debe guardar un evento ya verificado dentro de una lista de eventos
arrayEjemplo = [
    {
        "momentoInicio": 1,
        "momentoFin": 2
    },
    {
        "momentoInicio": 3,
        "momentoFin": 4
    },
    {
        "momentoInicio": 5,
        "momentoFin": 6
    },
    {
        "momentoInicio": 7,
        "momentoFin": 8
    }
]
def vaPrimeroEnLaBD(inicioEvento, finEvento, inicioOtroEvento, finOtroEvento): #retorna un valor booleano resultado de comprobar si un elemento va antes de otro
    if inicioEvento != inicioOtroEvento:
        return inicioEvento < inicioOtroEvento
    return finEvento < finOtroEvento
    
def buscarIndiceGuardar(listaEventos, indiceInicioBusqueda, indiceFinBusqueda, momentoInicio, momentoFin):
        if indiceInicioBusqueda > indiceFinBusqueda:
            return indiceInicioBusqueda
        
        indiceMedio = (indiceInicioBusqueda + indiceFinBusqueda)//2 #División entera para que no retorne un índice con coma
        inicioIndiceMedio = listaEventos[indiceMedio]['momentoInicio']
        finIndiceMedio = listaEventos[indiceMedio]['momentoFin']
        #IMPORTANTE, convertir en datetime

        if vaPrimeroEnLaBD(momentoInicio, momentoFin, inicioIndiceMedio, finIndiceMedio):
            return buscarIndiceGuardar(listaEventos, indiceInicioBusqueda, indiceMedio - 1, momentoInicio, momentoFin)
        return buscarIndiceGuardar(listaEventos, indiceMedio + 1, indiceFinBusqueda, momentoInicio, momentoFin)

def llamarFuncBuscarIndiceGuardar(listaDeEventos, momentoInicio, momentoFin):
    longitudLista = len(listaDeEventos)
    if longitudLista == 0:
        return 0 
    return buscarIndiceGuardar(listaDeEventos, 0, longitudLista-1, momentoInicio, momentoFin)
    
print(llamarFuncBuscarIndiceGuardar(arrayEjemplo, 0, 3))
print(llamarFuncBuscarIndiceGuardar(arrayEjemplo, 4, 5))

#Retorna una lista de todas las posibles colisiones de un evento que se quiere crear
def obtenerColisiones(listaEventos, momentoInicio, momentoFin):
    if listaEventos == []:
        return []

    indiceInicial = 0
    indiceFinal = len(listaEventos) - 1
    ultimoInicioMenorAlDelEvento = -1 #Retorna-1 en caso dee que no haya, por eso este es el valor inicial

    while indiceInicial <= indiceFinal:
        medio = (indiceInicial + indiceFinal) // 2
        if listaEventos[medio]['momentoInicio'] < momentoFin:
            # Verificar si hay otro más a la derecha
            ultimoInicioMenorAlDelEvento = medio
            indiceInicial = medio + 1
        else:
            indiceFinal = medio - 1

    if ultimoInicioMenorAlDelEvento == -1:
        return []

    colisiones = []
    for i in range(ultimoInicioMenorAlDelEvento + 1):
        evento = listaEventos[i]
        if evento['momentoFin'] > momentoInicio:
            colisiones.append(evento)

    return colisiones

def verificarTotalDeRecursosPosible(recursosNecesarios): #esto verifica si la demanda total es menor a la del inventario total y retorna booleano
    print('pendiente')

def sumarRecursosDosEventos(recursosEvento1, recursosEvento2):
    recursos = recursosEvento1
    for clave, valor in recursosEvento2.items():
        if clave in recursos:
            recursos[clave] += valor
        else:
            recursos[clave] = valor
    
    return recursos

def sumarRecursosVariosEventos(listaEventos):
    recursosAnteriores = {}
    for i in listaEventos:
        recursosAnteriores = sumarRecursosDosEventos(recursosAnteriores, i["recursos"])
    return recursosAnteriores








def calcularMayorDemandaDeRecursos(listaDeEventos, momentoInicio, momentoFin, recursosNecesarios):
    colisionesIniciales = obtenerColisiones(listaDeEventos, momentoInicio, momentoFin)
    
    if len(colisionesIniciales) == 0:
        return verificarTotalDeRecursosPosible(recursosNecesarios)
    
    def hallarIntervalos(posiblesColisiones):
        for i in posiblesColisiones:
            colisiones = obtenerColisiones(posiblesColisiones)
            totalRecursos = sumarRecursosDosEventos(sumarRecursosVariosEventos(colisiones), recursosNecesarios)
            verificarTotalDeRecursosPosible()




    

            









    

    

    
