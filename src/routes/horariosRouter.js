const horarios = require("express").Router();
const horariosController = require("../app/controllers/horariosController");

horarios.get("/api/horarios/setor/:setor", horariosController.getHorarioLivre);
horarios.get("/api/horario/sala/:sala", horariosController.getHorarioBySala);
horarios.get("/api/horarios/:id", horariosController.horarioInativo);

horarios.post("/api/horarios", horariosController.store);
horarios.put("/api/horarios/", horariosController.updateHorario);
horarios.delete("/api/horarios/:_id", horariosController.delelePeriodo);

module.exports = horarios;
