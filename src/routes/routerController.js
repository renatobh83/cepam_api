const indexRouter = require("./indexRouter");
const usersRouter = require("./usersRouter");
const gruposRouter = require("./gruposRouter");

const routerController = (app) => {
  app.use(indexRouter);
  app.use(usersRouter);
  app.use(gruposRouter);
};
module.exports = routerController;
