const { defaultResponse } = require("../../../utils/responseControllers");

class IndexController {
  async index(req, res) {
    res.send(defaultResponse("Server On"));
  }
}

module.exports = new IndexController();
