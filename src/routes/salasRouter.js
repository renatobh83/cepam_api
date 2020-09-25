const salas = require("express").Router();
const salasController = require("../app/controllers/salasController");

salas.get("/api/salas", salasController.index);
// salas.get("/api/salas/:name", salasController.findGrupo);
// salas.post("/api/salas", salasController.store);
// salas.put("/api/salas/:_id", salasController.updateGrupo);
// salas.delete("/api/salas/:_id", salasController.delete);

module.exports = salas;
