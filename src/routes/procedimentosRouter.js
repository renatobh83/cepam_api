const procedimentos = require("express").Router();
const procedimentosController = require("../app/controllers/procedimentosController");

procedimentos.get("/api/procedimentos", procedimentosController.index);
procedimentos.put(
  "/api/procedimentos/:_id",
  procedimentosController.updateProcedimento
);
procedimentos.post("/api/procedimentos", procedimentosController.store);
procedimentos.delete("/api/procedimentos/:_id", procedimentosController.delete);

module.exports = procedimentos;
