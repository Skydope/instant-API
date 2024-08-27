const express = require('express');
const router = express.Router();
const Response = require('../models/Response');

// Generar URL única (puedes personalizar esta función)
const generateUniqueUrl = () => Math.random().toString(36).substring(2, 15);

// Cargar una nueva respuesta
router.post('/upload', async (req, res) => {
    const { method, headers, body } = req.body;
    const url = generateUniqueUrl();

    let response = new Response({ url, method, headers, body });
    response = await response.save();

    res.status(201).send({ message: 'Response saved!', url: `${req.protocol}://${req.get('host')}/${url}` });
});
// Obtener TODAS las Respuestas
app.get('/responses', async (req, res) => {
    try {
        const responses = await Response.find(); // Encuentra todos los documentos
        res.status(200).json(responses); // Devuelve los documentos como JSON
    } catch (err) {
        console.error('Error al obtener las respuestas:', err);
        res.status(500).send('Server error:', err);
    }
});
// Obtener API por ID

// Obtener una respuesta
router.get('/:url', async (req, res) => {
    const { url } = req.params;
    const response = await Response.findOne({ url });

    if (!response) return res.status(404).send('Response not found.');

    res.status(200).send(response.body);
});

module.exports = router;