const horarios = require('express').Router();
const horariosController = require('../app/controllers/horariosController');

horarios.get('/api/horarios/setor/:setor', horariosController.getHorarioLivre);
horarios.get('/api/horario/sala/:sala', horariosController.getHorarioBySala);
horarios.get('/api/horarios/:id', horariosController.horarioInativo);

horarios.post('/api/horarios', horariosController.store);
horarios.put('/api/horarios/', horariosController.updateHorario);
horarios.put('/api/horarios/:id', horariosController.desativarHorario);
horarios.post('/api/horarios/delete', horariosController.delelePeriodo);
horarios.get('/api/horarios', horariosController.horariosSetor);
// horarios agendamento
horarios.post('/api/horarios/exames', horariosController.examesComHorario);
horarios.post('/api/horarios/setor', horariosController.horariosSetor);
module.exports = horarios;
