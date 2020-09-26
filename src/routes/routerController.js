const indexRouter = require("./indexRouter");
const usersRouter = require("./usersRouter");
const gruposRouter = require("./gruposRouter");
const permissoes = require("./permissoesRouter");
const setores = require("./setoresRouter");
const salas = require("./salasRouter");
const planos = require("./planosRouter");
const procedimentos = require("./procedimentosRouter");
const tabelas = require("./tabelasRouter");
const horarios = require("./horariosRouter");

const routerController = (app) => {
  app.use(indexRouter);
  app.use(usersRouter);
  app.use(gruposRouter);
  app.use(permissoes);
  app.use(setores);
  app.use(salas);
  app.use(planos);
  app.use(procedimentos);
  app.use(tabelas);
  app.use(horarios);
};
module.exports = routerController;
