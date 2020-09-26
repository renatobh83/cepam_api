const tabelas = require("express").Router();
const tabelasController = require("../app/controllers/tabelasController");

tabelas.get("/api/tabelas", tabelasController.index);
tabelas.put("/api/tabelas/:_id", tabelasController.updateTabela);
tabelas.post("/api/tabelas", tabelasController.store);
tabelas.delete("/api/tabelas/:_id", tabelasController.deleteProcedimento);

module.exports = tabelas;
