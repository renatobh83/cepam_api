const salas = require('express').Router();
const salasController = require('../app/controllers/salasController');
const verifyToken = require('../middlewares/verifyToken');
const { check } = require('../middlewares/permissao');

salas.get('/api/salas', verifyToken, check, salasController.index);
salas.get('/api/salas/cadastro', verifyToken, salasController.index);
salas.post('/api/salas', verifyToken, check, salasController.store);
salas.delete('/api/salas/:_id', verifyToken, check, salasController.delete);
salas.get(
  '/api/salas/intervalo/:_id',
  verifyToken,
  check,
  salasController.tempoSala
);

module.exports = salas;
