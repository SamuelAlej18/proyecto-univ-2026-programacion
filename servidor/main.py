
from flask import Flask
app = Flask(__name__)  

#Rutas
@app.route('/')
def inicial():
	return 'Bienvenidos a mi servidor principal'



if __name__ == '__main__':
	app.run(
        debug = True,
        port=5000
    )
