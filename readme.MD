
# 📚 Backend Instant API Documentation

Esta documentación describe la API backend de tu aplicación, incluyendo los modelos, rutas, y el servidor. La estructura de la aplicación es como se muestra a continuación:

```
📂 INSTANT-API
 ┣ 📂 models
 ┃ ┗ 📄 response.js
 ┣ 📂 routes
 ┃ ┗ 📄 responses.js
 ┣ 📄 .env ┣ 📄 .gitignore
 ┣ 📄 package-lock.json
 ┣ 📄 package.json
 ┣ 📄 readme.MD
 ┗ 📄 server.js
```

## 🌐 Modelos

### `models/response.js`

El modelo `Response` define la estructura de los datos que se almacenarán en MongoDB. Utiliza Mongoose para definir el esquema de la colección.

```javascript
const mongoose = require('mongoose');
const moment = require('moment');

const responseSchema = new mongoose.Schema({
 url: { type: String, required: true, unique: true },
 method: { type: String, default: 'GET' },
 headers: { type: Object, default: {} },
 body: { type: Object, required: true },
 alias: { type: String, required: true },
 createdAt: { type: String, default: () => moment().format('DD-MM-YYYY HH:mm:ss') }
});

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;
```

### Descripción del Modelo:

- `url`: La URL única generada para cada respuesta, es de tipo `String` y es requerida.
- `method`: El método HTTP asociado con la respuesta, por defecto es `GET`.
- `headers`: Los encabezados HTTP, almacenados como un objeto.
- `body`: El cuerpo de la respuesta, es de tipo `Object` y es requerido.
- `alias`: Un alias único para identificar la respuesta, es de tipo `String` y es requerido.
- `createdAt`: La fecha de creación de la respuesta, por defecto es la fecha y hora actual en formato `DD-MM-YYYY HH:mm:ss`.

## 🚦 Rutas

### `routes/responses.js`

Este archivo define las rutas relacionadas con las operaciones CRUD para las respuestas almacenadas en la base de datos.

#### 1. 📤 Cargar una nueva respuesta

Ruta: `POST /upload`

Esta ruta permite subir una nueva respuesta al sistema. Se genera una URL única para la respuesta.

```javascript
router.post('/upload', async (req, res) => {
 const { method, headers, body } = req.body;
 const url = generateUniqueUrl();

 let response = new Response({ url, method, headers, body });
 response = await response.save();

 res.status(201).send({ message: 'Response saved!', url: `${req.protocol}://${req.get('host')}/${url}` });
});
```

#### 2. 🗂 Obtener todas las respuestas

Ruta: `GET /responses`

Esta ruta obtiene todas las respuestas almacenadas en la base de datos.

```javascript
router.get('/responses', async (req, res) => {
 try {
 const responses = await Response.find();
 res.status(200).json(responses);
 } catch (err) {
 console.error('Error al obtener las respuestas:', err);
 res.status(500).send('Server error');
 }
});
```

#### 3. 🔍 Obtener una respuesta por URL

Ruta: `GET /:url`

Esta ruta obtiene una respuesta específica basada en la URL proporcionada.

```javascript
router.get('/:url', async (req, res) => {
 const { url } = req.params;
 const response = await Response.findOne({ url });

 if (!response) return res.status(404).send('Response not found.');

 res.status(200).send(response.body);
});
```

## 🚀 Servidor

### `server.js`

Este archivo configura el servidor Express y conecta la aplicación con MongoDB.

#### Conexión a MongoDB

```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGOURI = process.env.MONGODB_URI;
app.use(express.json());

mongoose.connect(MONGOURI)
 .then(() => console.log('Connected to MongoDB'))
 .catch(err => console.error('Could not connect to MongoDB', err));
```

#### Rutas del Servidor

Las rutas definidas en `server.js` permiten manejar diversas operaciones CRUD para las respuestas.

##### 📝 Crear y guardar una respuesta

Ruta: `POST /upload`

```javascript
app.post('/upload', async (req, res) => {
 try {
 const response = new Response({
 body: req.body
 });
 await response.save();
 res.status(201).send(response);
 } catch (err) {
 res.status(500).send('Server error:');
 }
});
```

##### 🗂 Obtener todas las respuestas

Ruta: `GET /responses`

```javascript
app.get('/responses', async (req, res) => {
 try {
 const responses = await Response.find();
 res.status(200).json(responses);
 } catch (err) {
 console.error('Error al obtener las respuestas:', err);
 res.status(500).send('Server error');
 }
});
```

##### 🔍 Obtener una respuesta por ID

Ruta: `GET /response/:id`

```javascript
app.get('/response/:id', async (req, res) => {
 try {
 const response = await Response.findById(req.params.id);
 if (!response) {
 return res.status404).send('Document not found');
 }
 res.status(200).json(response);
 } catch (err) {
 console.error('Error al encontrar documento:', err);
 res.status(500).send('Server error');
 }
});
```

##### 🗑 Eliminar una respuesta por ID

Ruta: `DELETE /responses/:id`

```javascript
app.delete('/responses/:id', async (req, res) => {
 try {
 const response = await Response.findByIdAndDelete(req.params.id);
 if (!response) {
 return res.status(404).send('Document not found');
 }
 res.status(200).send('Document deleted successfully');
 } catch (err) {
 console.error('Error al eliminar el documento:', err);
 res.status500).send('Server error');
 }
});
```

### 🌟 Ejemplo de uso

```bash
# Subir una nueva respuesta
curl -X POST -H \"Content-Type: application/json\" -d '{\"method\":\"POST\",\"headers\":{\"Authorization\":\"Bearer token\"},\"body\":{\"key\":\"value\"}}' http://localhost:3000/upload

# Obtener todas las respuestas
curl http://localhost:3000/responses

# Obtener una respuesta específica por URL
curl http://localhost:3000/[URL_GENERADA]

# Eliminar una respuesta por ID
curl -X DELETE http://localhost:3000/responses/[ID]
```

---


