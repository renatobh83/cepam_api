const permissoes = require("express").Router();
const permissoesController = require("../app/controllers/permissoesController");

permissoes.get("/api/permissoes", permissoesController.index);
permissoes.delete("/api/permissoes/:_id", permissoesController.delete);
permissoes.post("/api/permissoes", permissoesController.store);
permissoes.post("/api/permissao/grupo", permissoesController.includeGrupo);

module.exports = permissoes;
