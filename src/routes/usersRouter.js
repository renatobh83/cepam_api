const users = require("express").Router();
const usersController = require("../app/controllers/usersController");

// login
users.get("/api/usuarios/login", usersController.loginUser);

// rotas usuarios
users.get("/api/usuarios", usersController.indexUsers);
users.get("/api/usuarios/:email", usersController.findUser);
users.post("/api/usuarios", usersController.store);
users.put("/api/usuarios/:email", usersController.UpdateUserPatient);
users.delete("/api/usuarios/:email", usersController.deactiveOrActive);

// rotas pacientes
users.get("/api/pacientes/", usersController.indexPacientes);

module.exports = users;
