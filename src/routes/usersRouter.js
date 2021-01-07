const users = require('express').Router();

const usersController = require('../app/controllers/usersController');
const { check } = require('../middlewares/permissao');
const verifyToken = require('../middlewares/verifyToken');

// login
users.get('/api/usuarios/login', verifyToken, usersController.loginUser);

// rotas usuarios
users.get('/api/usuarios', verifyToken,check, usersController.indexUsers);
// users.get('/api/usuarios/:email', verifyToken, usersController.findUser);
users.post('/api/usuarios', verifyToken,check, usersController.store);
users.post('/api/paciente', verifyToken,check, usersController.storePaciente);
users.put('/api/usuarios/:_id', verifyToken,check, usersController.UpdateUserPatient);
users.delete(
  '/api/usuarios/:email',
  verifyToken,
  check,
  usersController.deactiveOrActive
);

// rotas pacientes
users.get('/api/pacientes/', verifyToken, usersController.indexPacientes);

// info Dash
users.get('/api/user/dash/', verifyToken, usersController.infoDash);

module.exports = users;
