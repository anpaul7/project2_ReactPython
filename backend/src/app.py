
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS #reglas para interactuar server flask python-server react

app = Flask(__name__)
#CORS = (app) #pasar app construida, para frondend
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

client = MongoClient('mongodb://localhost:27017/')
db = client['prueba']
collection = db['usuarios']

#-- crear una ruta
#@app.route('/')
#def index():
#    return '<h1>Web Site</h1>'

#--enlace
@app.route('/insert', methods=['POST']) #create user
def createUser():
    data = request.get_json() #para traer de postman
    #data = {"id":123, "name":"pepito", "password":"123456"}
    result = collection.insert_one(data)
    response_data = {
        'msg': 'create data user',
        'inserted_id': str(result.inserted_id)
    }
    #return jsonify({'msg':'create data user'})
    return jsonify(response_data)

@app.route('/find', methods=['GET'])#obtener data users
def getUsers():    
    #recuperar datos coleccion
    documents = collection.find()
    #convertir datos en lista de diccionarios jsonify
    data = []
    for doc in documents:
        #convierte objectID en cadena
        doc['_id'] = str(doc['_id'])
        data.append(doc)

    #devuelve datos en JSON
    return jsonify(data)

@app.route('/getuser/<id>', methods=['GET']) #get data user
def getUser(id):
    
    data = collection.find_one({'_id':ObjectId(id)})
    if data:
        data['_id'] = str(data['_id']) 
    #devuelve datos en JSON
    return jsonify(data)

@app.route('/deleteuser/<id>', methods=['DELETE']) #delete user
def deleteUser(id):
    try:
        data = collection.delete_one({'_id':ObjectId(id)})

        # Verifica si se eliminó correctamente el documento
        if data.deleted_count == 1:
            return jsonify({'msg':'delete user'})
        else:
            return jsonify({"error": "No user encontrado."}), 404
    except Exception as e:
        # Maneja el error y devuelve un mensaje de error
        return jsonify({"error": str(e)}), 500


@app.route('/updateuser/<id>', methods=['PUT']) #update
def updateUser(id):
    try:
        object_id = ObjectId(id) #id 
        object_data = request.json # datos cuerpo solicitud actualizar

        object_data.pop('_id',None) # elimina campo id objeto registro actualizar
        data = collection.update_one({'_id':object_id}, {'$set':object_data})

        # Verifica si se actualizo correctamente el documento
        if data.modified_count == 1:
            return jsonify({'msg':'update data user'})
        else:
            return jsonify({"error": "No update data user"}), 404
    except Exception as e:
        # Maneja el error y devuelve un mensaje de error
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
 #   app.run(port=5000)