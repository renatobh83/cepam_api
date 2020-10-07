const setores = require('express').Router();
const setoresController = require('../app/controllers/setoresController');

setores.get('/api/setores', setoresController.index);
setores.get('/api/setores/cadastro', setoresController.index);
setores.get('/api/setores/:_id', setoresController.findSetor);
setores.post('/api/setores', setoresController.store);
setores.put('/api/setores/:_id', setoresController.updateSetor);
setores.delete('/api/setores/:_id', setoresController.delete);

module.exports = setores;
