const users = require("express").Router();
const usersController = require("../app/controllers/usersController");

// login
users.get("/api/users/login", usersController.loginUser);

// rotas usuarios
users.get("/api/users", usersController.indexUsers);
users.get("/api/users/:email", usersController.findUser);
users.post("/api/users", usersController.store);
users.put("/api/users/:email", usersController.UpdateUserPatient);
users.delete("/api/users/:email", usersController.deactiveOrActive);

// rotas pacientes
users.get("/api/pacientes/", usersController.indexPacientes);

module.exports = users;
