const horarios = require("express").Router();
const horariosController = require("../app/controllers/horariosController");

// horarios.get("/api/horarios", horariosController.indexGrupos);
// horarios.get("/api/horarios/:name", horariosController.findGrupo);
horarios.post("/api/horarios", horariosController.store);
// horarios.put("/api/horarios/:_id", horariosController.updateGrupo);
// horarios.delete("/api/horarios/:_id", horariosController.delete);

module.exports = horarios;
