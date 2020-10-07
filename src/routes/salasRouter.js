const salas = require('express').Router();
const salasController = require('../app/controllers/salasController');

salas.get('/api/salas', salasController.index);
salas.get('/api/salas/cadastro', salasController.index);
salas.post('/api/salas', salasController.store);
salas.delete('/api/salas/:_id', salasController.delete);
salas.get('/api/salas/intervalo/:_id', salasController.tempoSala);

module.exports = salas;
