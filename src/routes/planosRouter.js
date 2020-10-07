const planos = require("express").Router();
const planosController = require("../app/controllers/planosController");
const verifyToken = require("../middlewares/verifyToken");
const { check } = require("../middlewares/permissao");
planos.get("/api/planos", verifyToken, check, planosController.index);
planos.post("/api/planos", verifyToken, check, planosController.store);
planos.delete("/api/planos/:_id", verifyToken, check, planosController.delete);
planos.put(
  "/api/planos/:_id",
  verifyToken,
  check,
  planosController.updatePlano
);

module.exports = planos;
