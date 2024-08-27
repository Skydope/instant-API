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