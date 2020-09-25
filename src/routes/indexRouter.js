const index = require("express").Router();
const indexController = require("../app/controllers/indexController");

index.get("/api/", indexController.index);

module.exports = index;
