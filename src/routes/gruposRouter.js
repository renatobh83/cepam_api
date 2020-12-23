const grupos = require('express').Router();
const gruposController = require('../app/controllers/gruposController');
const verifyToken = require('../middlewares/verifyToken');
const { check } = require('../middlewares/permissao');

grupos.get('/api/grupos/cadastro', verifyToken, gruposController.indexGrupos);
grupos.get('/api/grupos/:_id', verifyToken, gruposController.findGrupo);
// rotas protegidas
grupos.get('/api/grupos', verifyToken, check, gruposController.indexGrupos);
grupos.post('/api/grupos', verifyToken, check, gruposController.store);
grupos.put(
  '/api/grupos/:_id',
  verifyToken,
  check,
  gruposController.updateGrupo
);
grupos.delete('/api/grupos/:_id', verifyToken, check, gruposController.delete);

module.exports = grupos;
