const httpStatus = require("http-status");
const {
  defaultResponse,
  errorResponse,
} = require("../../../utils/responseControllers");
const Tabelas = require("../../models/Tabelas");

class TabelasController {
  async index(req, res) {
    try {
      const tabelas = await Tabelas.find({});
      res.send(defaultResponse(tabelas));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  async store(req, res) {
    try {
      const tabelaExist = await Tabelas.findOne({ name: req.body.name });
      if (tabelaExist) {
        res.send(defaultResponse(tabelaExist));
      } else {
        const newTabela = await Tabelas.create(req.body);
        res.send(defaultResponse(newTabela));
      }
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async updateTabela(req, res) {
    try {
      await Tabelas.updateOne(req.params, { $set: { exames: req.body } });
      res.send(defaultResponse({}, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async deleteProcedimento(req, res) {
    try {
      await Tabelas.updateOne(req.params, {
        $pull: { exames: req.body },
      });
      res.send(defaultResponse(httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(erroResponse(error.message));
    }
  }
}

module.exports = new TabelasController();
