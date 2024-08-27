require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');


const app = express();
const PORT = process.env.PORT || 3000;
const MONGOURI = process.env.MONGODB_URI;
app.use(express.json()); // Asegúrate de que Express pueda manejar JSON

mongoose.connect(MONGOURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Esquema de Mongoose para guardar los JSON
const responseSchema = new mongoose.Schema({
    body: Object, // Cambia Object a cualquier otro esquema que necesites
    createdAt: { type: String, default: () => moment().format('DD-MM-YYYY HH:mm:ss') }
});

const Response = mongoose.model('Response', responseSchema);

// Ruta para manejar POST en /upload
app.post('/upload', async (req, res) => {
    try {
        const response = new Response({
            body: req.body
        });
        await response.save();
        res.status(201).send(response); // Retorna la respuesta guardada
    } catch (err) {
        res.status(500).send('Server error:');
    }
});
// Obtener todas las APIs
app.get('/responses', async (req, res) => {
    try {
        const responses = await Response.find(); // Encuentra todos los documentos
        res.status(200).json(responses); // Devuelve los documentos como JSON
    } catch (err) {
        console.error('Error al obtener las respuestas:', err);
        res.status(500).send('Server error');
    }
});

// Obtener API por ID y Devolverlo
app.get('/response/:id', async (req, res) => {
    try {
        const response = await Response.findById(req.params.id);
        if (!response) {
            return res.status(404).send('Document not found');
        }
        // Devolver el documento encontrado
        res.status(200).json(response);
    } catch (err) {
        console.error('Error al encontrar documento:', err);
        res.status(500).send('Server error');
    }
});

// Obtener body de API por ID y Devolverlo Como Json
app.get('/response/api/json/:id', async (req, res) => {
    try {
        const response = await Response.findById(req.params.id);
        if (!response) {
            return res.status(404).send('Document not found');
        }
        // Devolver el documento encontrado
        res.status(200).json(response.body);
    } catch (err) {
        console.error('Error al encontrar documento:', err);
        res.status(500).send('Server error');
    }
});

// Obtener propiedades de API 
app.get('/response/json/:id', async (req, res) => {
    try {
        const response = await Response.findById(req.params.id);
        if (!response) {
            return res.status(404).send('Document not found');
        }
        // Devolver el documento encontrado, incluyendo el alias
        res.status(200).json({
            alias: response.alias,
            url: response.url,
            method: response.method,
            headers: response.headers,
            body: response.body,
            createdAt: response.createdAt
        });
    } catch (err) {
        console.error('Error al encontrar documento:', err);
        res.status(500).send('Server error');
    }
});


// Ruta para manejar DELETE en /responses/:id
app.delete('/responses/:id', async (req, res) => {
    try {
        const response = await Response.findByIdAndDelete(req.params.id);
        if (!response) {
            return res.status(404).send('Document not found');
        }
        res.status(200).send('Document deleted successfully');
    } catch (err) {
        console.error('Error al eliminar el documento:', err);
        res.status(500).send('Server error');
    }
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
