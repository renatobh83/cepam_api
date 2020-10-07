const grupos = require('express').Router();
const gruposController = require('../app/controllers/gruposController');

grupos.get('/api/grupos', gruposController.indexGrupos);
grupos.get('/api/grupos/cadastro', gruposController.indexGrupos);

grupos.get('/api/grupos/:_id', gruposController.findGrupo);
grupos.post('/api/grupos', gruposController.store);
grupos.put('/api/grupos/:_id', gruposController.updateGrupo);
grupos.delete('/api/grupos/:_id', gruposController.delete);

module.exports = grupos;
