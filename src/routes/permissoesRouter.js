const permissoes = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');
const permissoesController = require('../app/controllers/permissoesController');

permissoes.get('/api/permissoes', verifyToken, permissoesController.index);
permissoes.delete(
  '/api/permissoes/:_id',
  verifyToken,
  permissoesController.delete
);
permissoes.post('/api/permissoes', verifyToken, permissoesController.store);
permissoes.post(
  '/api/permissao/grupo',
  verifyToken,
  permissoesController.includeGrupo
);

module.exports = permissoes;
