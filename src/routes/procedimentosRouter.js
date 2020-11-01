const procedimentos = require('express').Router();
const procedimentosController = require('../app/controllers/procedimentosController');
const verifyToken = require('../middlewares/verifyToken');
const { check } = require('../middlewares/permissao');

procedimentos.get(
  '/api/procedimentos',
  verifyToken,
  check,
  procedimentosController.index
);
procedimentos.get(
  '/api/procedimentos/tabela',
  verifyToken,
  procedimentosController.procedimentoTabelas
);
procedimentos.put(
  '/api/procedimentos/:_id',
  verifyToken,
  check,
  procedimentosController.updateProcedimento
);

procedimentos.post(
  '/api/procedimentos',
  verifyToken,
  check,
  procedimentosController.store
);
procedimentos.delete(
  '/api/procedimentos/:_id',
  verifyToken,
  check,
  procedimentosController.delete
);

module.exports = procedimentos;
