const setores = require('express').Router();
const setoresController = require('../app/controllers/setoresController');
const verifyToken = require('../middlewares/verifyToken');
const { check } = require('../middlewares/permissao');

setores.get('/api/setores', verifyToken, check, setoresController.index);
setores.get('/api/setores/cadastro', verifyToken, setoresController.index);
// setores.get(
//   '/api/setores/:_id',
//   verifyToken,
//   check,
//   setoresController.findSetor
// );
setores.post('/api/setores', verifyToken, check, setoresController.store);
setores.put(
  '/api/setores/:_id',
  verifyToken,
  check,
  setoresController.updateSetor
);
setores.delete(
  '/api/setores/:_id',
  verifyToken,
  check,
  setoresController.delete
);

module.exports = setores;
