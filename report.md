# Informe del Proyecto: Planificador de Conciertos

# Estudiante: Samuel Alejandro Vera Power
## Grupo: C111

## Introducción
El presente proyecto consiste en el desarrollo de una aplicación web para la gestión de eventos musicales en un complejo cultural con cuatro espacios escénicos. El sistema permite a los empleados registrarse, iniciar sesión y crear, visualizar y eliminar conciertos, respetando un conjunto de reglas de negocio relacionadas con la disponibilidad de recursos, la logística de los lugares y la concurrencia de artistas de talla mundial.

El programa ha sido diseñado para ser utilizado por el personal de la empresa encargado de la planificación de los eventos, ofreciendo una interfaz sencilla pero funcional que se comunica con un servidor local. A lo largo del desarrollo, se han aplicado conceptos de programación en Python, manejo de archivos JSON, algoritmos de búsqueda y ordenamiento, así como principios de diseño de interfaces de usuario con HTML, CSS y JavaScript.

## Escenario
Es un complejo de 4 lugares con un almacén central que tiene una capacidad limitada de recursos para realizar los conciertos. Por la forma de la edificación no es necesario tener en cuenta en la creación de eventos el tiempo para considerar mover los instrumentos, y no se tiene en cuenta. 

## Descripción general del programa

El Planificador de Conciertos es una aplicación web cliente-servidor que permite:

· Registro de usuarios con validación de nombre de usuario y contraseña, más una clave secreta de empresa.
· Inicio de sesión seguro y verificación de credenciales.
· Creación de eventos con nombre, lugar, fechas (inicio y fin), indicación de artista mundial y selección de recursos (instrumentos y equipamiento).
· Validación automática de todas las restricciones de negocio (disponibilidad de recursos, duración, solapamientos, reglas específicas por lugar, etc.).
· Visualización de eventos en una lista ordenada cronológicamente.
· Eliminación de eventos mediante un botón por cada elemento.
· Búsqueda de fecha alternativa para aquellos eventos que no puedan realizarse en la fecha propuesta, explorando los próximos 30 días.
· Limpieza automática de eventos ya finalizados al cargar la lista.

## Diseño y arquitectura:
3.1. Elección de tecnologías:
Para el desarrollo se optó por Python con el framework de Flask para el backend, debido a su simplicidad, flexibilidad y la facilidad para crear APIs REST. Flask permite manejar rutas, recibir peticiones JSON y devolver respuestas de manera ágil, lo cual se ajusta perfectamente a las necesidades del proyecto.Para la persistencia de los datos se decidió usar JSON. Se utiliza el módulo datetime para gestionar las fechas dentro del proyecto.

En el frontend se utilizó HTML5, CSS3 y JavaScript sin frameworks. Esta decisión se tomó para mantener la aplicación ligera y no depender de bibliotecas externas que pudieran complicar la instalación o el entendimiento del código. La comunicación con el servidor se realiza mediante fetch asíncrono, lo que permite una experiencia de usuario fluida sin recargas de página. 

## Estructura del proyecto:
- carpeta servidor:
  - crearUsuario.py
  - funciones.py
  - main.py
  - carpeta datos:
    - recursos.json() 
    - usuarios.json()
    - Nota: si los archivos no están se crean automáticamente

- carpeta web: 
  -index.html
  -style.css
  -script.js

## Decisiones tomadas: 
1. Ordenamiento por inserción: En lugar de reordenar toda la lista cada vez que se añade un evento, se utiliza una búsqueda binaria para encontrar la posición correcta y luego insertar. Esto es eficiente porque la lista ya se mantiene ordenada por fecha de inicio, y final en caso de empate. La función llamarFuncBuscarIndiceGuardar(...) implementa este algoritmo.
2. Manejo de colisiones: La función obtenerColisiones(...) utiliza búsqueda binaria para obtener rápidamente los eventos que solapan con el intervalo dado. Esto es fundamental para verificar la disponibilidad de recursos y lugares de forma eficiente.
3. Barrido de demanda máxima: Para determinar si un evento es viable, se calcula la demanda máxima de cada recurso en el intervalo del evento (incluyendo colisiones). Esta técnica, implementada en calcularMayorDemandaDeRecursos(...), convierte los eventos en puntos de inicio y fin y realiza un barrido para encontrar el pico de uso de cada recurso.
## Funcionalidades principales
1. Registro e inicio de sesión
El sistema permite a los empleados registrarse con un nombre de usuario y una contraseña que deben cumplir las condiciones que se muestran al momento de la creación. Se requiere una clave secreta de la empresa a la hora de crear un usuario nuevo con acceso al sistema, 'El concierto'.

2. Validación de los eventos ingresados:
- El nombre no está vacío y cumple el formato.
- El lugar es uno de los permitidos.
- Las fechas son válidas, el inicio es anterior al fin, la duración está entre 1 hora y 3 días.
- El evento debe ser creado con al menos 24 horas de antelación.

- Si se solicita brea, también debe haber violín, y viceversa.
- No se permiten amplificadores sin guitarras, y el número de amplificadores debe ser mayor para el caso en que alguno falle.
- En Sala 23 o Cuarto del Rock, no pueden coexistir piano y batería, y solo se permite un piano o una batería, no más de uno, por temas de espacio.
- Se exige al menos una cámara, y además una cámara adicional por cada tres instrumentos musicales (incluyendo micrófonos).
-  Se comprueba que los recursos solicitados estén disponibles en el inventario, considerando la demanda máxima durante todo el evento (incluyendo colisiones con otros eventos).
- Se verifica que el lugar no esté ocupado por otro evento en el mismo intervalo.
- Se prohíbe que dos eventos con el mismo nombre ocurran el mismo día.
- Se prohíbe que dos eventos con artista mundial coincidan en el mismo día (incluso en lugares distintos).
- etc

3. Visualización y eliminación
Los eventos se muestran en tarjetas que incluyen nombre, fechas, lugar, si tiene artista mundial y la lista de recursos con sus cantidades. Cada tarjeta tiene un botón "Eliminar" que, tras confirmación, envía una petición DELETE al servidor.

4. Búsqueda de fecha alternativa
Si un evento no puede ser agendado en la fecha propuesta, el usuario puede pulsar "Buscar fecha alternativa". El sistema intentará desplazar el evento 1, 2, ..., hasta 30 días hacia adelante, manteniendo la misma duración y recursos, y verificando que no haya colisiones ni violación de reglas. Si encuentra una fecha válida, devuelve un mensaje informando en cuántos días es posible.

5. Limpieza de eventos expirados
Al cargar la lista de eventos, la función eliminarEventosExpirados() filtra aquellos cuya fecha de finalización ya pasó. Esto mantiene la base de datos limpia y evita que eventos antiguos ocupen espacio o interfieran en las validaciones.

## Detalles de implementación
1. Manejo de fechas
Todas las fechas se manejan como objetos datetime de Python, y se convierten hacia cadenas de formato YYYY-MM-DDTHH:MM mediante datetime.fromisoformat(). La función convertirStrDatetime es tolerante y devuelve None si el formato es inválido.

2. Algoritmo de búsqueda binaria para inserción
La lista de eventos se mantiene ordenada por momentoInicial, y en caso de empate por momentoFinal. Para insertar un nuevo evento, se utiliza una búsqueda binaria recursiva. (buscarIndiceGuardar) que compara el nuevo evento con el del medio usando vaPrimeroEnLaBD. Esto garantiza inserciones en O(log n) en promedio, y es mucho más eficiente que reordenar la lista completa.

3. obtenerColisiones() encuentra todos los eventos que se solapan con un intervalo dado. Primero localiza mediante búsqueda binaria el último evento cuyo inicio es menor que el fin del intervalo. Luego recorre desde el principio hasta esa posición y selecciona aquellos cuyo final es mayor que el inicio del intervalo. Este método es eficiente porque solo examina un subconjunto de la lista.

4. Barrido de demanda máxima
Para verificar la disponibilidad de recursos, se construye una lista de "puntos" (tiempo, tipo, recursos). Los puntos de inicio suman recursos, los de fin los restan. Al recorrer la lista en orden temporal, se mantiene la demanda actual y se actualiza la demanda máxima. Luego se compara con el inventario. Este enfoque permite conocer el pico de uso de cada recurso sin simular segundo a segundo.

## Aprendizaje durante el desarrollo:
Se aprendió a diseñar una API REST con Flask, manejar peticiones y respuestas en JSON, y comunicar el frontend mediante fetch. Comprender el flujo de datos entre el navegador y el servidor ha sido clave.
Trabajar con JSON como base de datos contribuyó al aprendizaje las ventajas y limitaciones de este enfoque.
Se desarrollaron las habilidades de ordenamiento y uso de búsqueda binaria aprendidos durante el curso.
Manejar objetos datetime, calcular diferencias, sumar días y comparar fechas fue un desafío inicial.

# Requisitos previos
· Tener Python 3.8+ instalado.
Instalar las dependencias del archivo requirements.txt:
pip install -r requirements.txt

## Ejecutar el programa:
Abrir una terminal dentro de la carpeta servidor, luego ejecutar el archivo main.py con:
python main.py
El servidor se iniciará en http://localhost:5000.
Abrir el archivo index.html.
Nota: Se requiere internet en el primer uso para cargar las partículas

### Ejemplo de evento válido:

· Nombre: Temas Clasicos Cubanos
· Lugar: Anfiteatro del Bosque Plateado
· Inicio: 2027-07-15T10:00
· Fin: 2027-07-15T12:00
· Artista mundial: no
· Recursos: guitarra=2, amplificador=3, microfono=4, camara=3 

### Ejemplo de evento inválido (nombre incorrecto, tiene tilde):
Nombre: Grandes éxitos
· Lugar: Sala 23
· Inicio: 2027-07-15T10:00
· Fin: 2027-07-15T12:00
· Artista mundial: no
· Recursos: guitarra=2, amplificador=3, microfono=4, camara=3 
