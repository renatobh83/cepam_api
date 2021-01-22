const horarios = require('express').Router();
const horariosController = require('../app/controllers/horariosController');
const verifyToken = require('../middlewares/verifyToken');
const { check } = require('../middlewares/permissao');
const { isUser } = require('../middlewares/chekUser');

horarios.get(
  '/api/horarios/setor/:setor',
  verifyToken,
  check,
  horariosController.getHorarioLivre
);
horarios.get(
  '/api/horarios/sala/:sala/:pg',
  verifyToken,
  check,
  horariosController.getHorarioBySala
);
horarios.get(
  '/api/horarios/:id',
  verifyToken,
  check,
  horariosController.horarioInativo
);
horarios.get("/api/horarios/sala/:sala", verifyToken,
  check,horariosController.getHorarios)

horarios.post('/api/horarios', verifyToken, check, horariosController.store);
horarios.put('/api/horarios/', verifyToken, horariosController.updateHorario);
horarios.put(
  '/api/horarios/:id',
  verifyToken,
  horariosController.desativarHorario
);
horarios.post(
  '/api/horarios/delete',
  verifyToken,
  horariosController.delelePeriodo
);
horarios.get(
  '/api/horarios',
  verifyToken,
  check,
  horariosController.horariosSetor
);
// horarios agendamento
horarios.post(
  '/api/horarios/exames',
  verifyToken,
  horariosController.examesComHorario
);
horarios.post(
  '/api/horarios/setor',
  verifyToken,
  horariosController.horariosSetor
);

horarios.get(
  '/api/gerarHorarios',
  verifyToken,
  check,
  horariosController.verAcesso
);

// dados agendamento
horarios.post(
  '/api/agendamento/dados',
  verifyToken,
  horariosController.storeAgendamento
);
horarios.get(
  '/api/agendamento/agenda',
  verifyToken,
  isUser,
  horariosController.getAgendamentos
);
horarios.get(
  '/api/agendamento/:paciente',
  verifyToken,
  horariosController.getAgendamentoPaciente
);
horarios.post(
  '/api/agendamento/cancela/',
  verifyToken,
  horariosController.cancelAgendamento
);

module.exports = horarios;
