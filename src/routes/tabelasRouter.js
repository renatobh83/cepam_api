const tabelas = require('express').Router();
const tabelasController = require('../app/controllers/tabelasController');
const verifyToken = require('../middlewares/verifyToken');
const { check } = require('../middlewares/permissao');

tabelas.get('/api/tabelas', verifyToken, check, tabelasController.index);
tabelas.get('/api/tabelas/cadastro', verifyToken, tabelasController.index);

tabelas.put(
  '/api/tabelas/:_id',
  verifyToken,
  check,
  tabelasController.updateTabela
);
tabelas.put(
  '/api/tabelas/name/:_id',
  verifyToken,
  check,
  tabelasController.updateNomeTabela
);
tabelas.post('/api/tabelas', verifyToken, check, tabelasController.store);
tabelas.delete(
  '/api/tabelas/:_id',
  verifyToken,
  check,
  tabelasController.deleteProcedimento
);
tabelas.delete(
  '/api/tabelas/excluir/:_id',
  verifyToken,
  check,
  tabelasController.deleteTabela
);

module.exports = tabelas;
