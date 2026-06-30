from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os, json
from crearUsuario import inicioSes, crearUsuario
from funciones import comprobarExistenciaArchivo, convertirStrDatetime, verificarEvento,calcularMayorDemandaDeRecursos, llamarFuncBuscarIndiceGuardar,eliminarEvento, verificarPosibilidadEventoFuturo, eliminarRecursosSobrantes, obtenerColisionesDiasCompletos, verificarColisionConArtistaMundial, verificarEventoMismoNombreYDia, eliminarEventosExpirados


app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)

directorioBase = os.path.dirname(os.path.abspath(__file__))
rutaUsuarios = os.path.join(directorioBase, "datos", "usuarios.json")
rutaEventos = os.path.join(directorioBase, "datos", "recursos.json")

#Si los archivos de datos no existen los crea
if not comprobarExistenciaArchivo(rutaUsuarios):
    with open(rutaUsuarios, 'w', encoding='utf-8') as f:
        json.dump({}, f, indent=2)

if not comprobarExistenciaArchivo(rutaEventos):
    with open(rutaEventos, 'w', encoding='utf-8') as f:
        json.dump([], f, indent=2)

inventario = {
    "guitarra": 5,
    "bateria": 3,
    "piano": 2,
    "amplificador": 6,
    "microfono": 10,
    "violin": 2,
    "brea": 2,
    "camara": 12
}

with open(rutaUsuarios, "r", encoding='utf-8') as datos:
    usuarios = json.load(datos)

def cargarEventos():
    with open(rutaEventos, "r", encoding='utf-8') as datos:
        eventos = json.load(datos) 
        eventosPosteriores = eliminarEventosExpirados(eventos)
        if len(eventosPosteriores!= len(eventos)):
            with open(rutaEventos, 'w', encoding='utf-8') as f:
                json.dump(eventosPosteriores, f, indent=2, ensure_ascii= False)
        return eventosPosteriores

def guardarEvento(momentoInicio, momentoFin, evento):
    eventos = cargarEventos()
    indice = llamarFuncBuscarIndiceGuardar(eventos, momentoInicio, momentoFin)
    eventos.insert(indice, evento)
    with open(rutaEventos, 'w', encoding='utf-8') as f:
        json.dump(eventos, f, indent=2, ensure_ascii=False)
    return jsonify({"mensaje": "Evento guardado correctamente"}), 200

@app.route("/login", methods=["POST"])
def login():
    datos = request.get_json()
    usuario = datos.get('usuario')
    clave = datos.get('clave')
    if not usuario or not clave:
        return jsonify({"error": "Faltan usuario o clave"}), 400
    resultado = inicioSes(usuario, clave, usuarios)
    if resultado[0]:
        return jsonify({"mensaje": "Sesión iniciada"}), 200
    return jsonify({"error": "Usuario o clave incorrectos"}), 400

@app.route("/register", methods=["POST"])
def registrarUsuario():
    datos = request.get_json()
    usuario = datos.get('usuario')
    clave = datos.get('clave')
    claveSecreta = datos.get('claveSecreta')
    resultado = crearUsuario(usuario, clave, claveSecreta, usuarios)
    if resultado[0]:
        with open(rutaUsuarios, 'w', encoding='utf-8') as f:
            json.dump(resultado[1], f, indent=2)
        return jsonify({"mensaje": "Usuario registrado"}), 200
    return jsonify({"error": resultado[1]}), 400

@app.route("/eventos", methods=["GET"])
def obtenerEventos():
    return jsonify(cargarEventos())

@app.route("/ingresarEvento", methods=["POST"])
def ingresarEvento():
    datos = request.get_json()
    datos['nombreEvento'] = datos['nombreEvento'].strip() #hace que el nombre del evento recibido se guarde sin los espacios del inicio o final
    resultado = verificarEvento(datos)
    if not resultado[0]:
        return jsonify({"error": resultado[1]}), 400

    nombreEvento = datos['nombreEvento']
    momentoInicial = datos['momentoInicial']
    momentoFinal = datos['momentoFinal']
    lugar = datos['lugar']
    artistaMundial = datos['artistaMundial']
    if isinstance(artistaMundial, bool) or artistaMundial == 'true':
        artistaMundial = True
    else:
        artistaMundial = False
    recursos = eliminarRecursosSobrantes(datos['recursos'])
    if not recursos:
        return jsonify({"error": "No se enviaron recursos válidos"}), 400

    eventos = cargarEventos()
    inicio_dt = convertirStrDatetime(momentoInicial)
    fin_dt = convertirStrDatetime(momentoFinal)
    if inicio_dt is None or fin_dt is None:
        return jsonify({"error": "Fechas inválidas"}), 400

    if not calcularMayorDemandaDeRecursos(eventos, inicio_dt, fin_dt, recursos, inventario, lugar):
        return jsonify({"error": "Recursos insuficientes o colisión de lugar"}), 400

    colisionesDiasCompletos = obtenerColisionesDiasCompletos(momentoInicial, momentoFinal, eventos)
    if verificarEventoMismoNombreYDia(colisionesDiasCompletos, nombreEvento):
        return jsonify({"error": 'Existe otro recurso con el mismo nombre en uno de los días que se ejecuta el evento'})

    if artistaMundial == True:
        if verificarColisionConArtistaMundial(colisionesDiasCompletos):
            return jsonify({"error": 'Existe otro artista mundial en ese lugar en los días que se ejecuta el evento'})
        
    evento = {
        "nombreEvento": datos['nombreEvento'],
        "lugar": lugar,
        "artistaMundial": artistaMundial,
        "momentoInicial": momentoInicial,
        "momentoFinal": momentoFinal,
        "recursos": recursos
    }

    
    return guardarEvento(momentoInicial, momentoFinal, evento)

@app.route("/eliminarEvento/<int:indice>", methods=["DELETE"])
@cross_origin()
def eliminarEventoIndice(indice):
    eventos = cargarEventos()
    nuevaLista = eliminarEvento(eventos, indice)
    if nuevaLista is False:
        return jsonify({"error": "Índice fuera de rango"}), 400
    with open(rutaEventos, 'w', encoding='utf-8') as f:
        json.dump(nuevaLista, f, indent=2, ensure_ascii=False)
    return jsonify({"mensaje": "Evento eliminado"}), 200

@app.route("/eventoEnFuturo", methods=["POST"])
def encontrarPosibleEventoEnFuturo():
    datos = request.get_json()
    eventos = cargarEventos()
    resultado = verificarPosibilidadEventoFuturo(datos, inventario, eventos)
    if not resultado[0]:
        return jsonify({"error": resultado[1]}), 400
    dias = resultado[1]
    if dias == 1:
        return jsonify({"mensaje": "Disponible para mañana a la misma hora"}), 200
    return jsonify({"mensaje": f"Disponible en {dias} días"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)