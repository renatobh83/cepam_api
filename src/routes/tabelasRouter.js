const tabelas = require('express').Router();
const tabelasController = require('../app/controllers/tabelasController');

tabelas.get('/api/tabelas', tabelasController.index);
tabelas.put('/api/tabelas/:_id', tabelasController.updateTabela);
tabelas.put('/api/tabelas/name/:_id', tabelasController.updateNomeTabela);
tabelas.post('/api/tabelas', tabelasController.store);
tabelas.delete('/api/tabelas/:_id', tabelasController.deleteProcedimento);
tabelas.delete('/api/tabelas/excluir/:_id', tabelasController.deleteTabela);

module.exports = tabelas;
