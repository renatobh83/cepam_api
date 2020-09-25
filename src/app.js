const express = require("express");
const cors = require("cors");
const routerController = require("./routes/routerController");

class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.express.use(express.json());
    this.express.use(
      cors({
        origin: ["http://localhost:3000", "https://cepam.herokuapp.com"],
        credentials: true,
      })
    );
  }
  routes() {
    routerController(this.express);
  }
}
module.exports = new AppController().express;
