const indexRouter = require("./indexRouter");
const usersRouter = require("./usersRouter");
const gruposRouter = require("./gruposRouter");
const permissoes = require("./permissoesRouter");
const setores = require("./setoresRouter");
const salas = require("./salasRouter");

const routerController = (app) => {
  app.use(indexRouter);
  app.use(usersRouter);
  app.use(gruposRouter);
  app.use(permissoes);
  app.use(setores);
  app.use(salas);
};
module.exports = routerController;
