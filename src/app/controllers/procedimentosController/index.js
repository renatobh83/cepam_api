const httpStatus = require("http-status");
const {
  defaultResponse,
  errorResponse,
} = require("../../../utils/responseControllers");
const Procedimentos = require("../../models/procedimentos");

class ProcedimentosController {
  async index(req, res) {
    try {
      const procedimento = await Procedimentos.find({});
      res.send(defaultResponse(procedimento));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  async store(req, res) {
    try {
      const procedimentoExist = await Procedimentos.findOne({
        descricao: req.body.name,
      });
      if (procedimentoExist) {
        res.send(defaultResponse(procedimentoExist));
      } else {
        const newProcedimento = await Procedimentos.create(req.body);
        res.send(defaultResponse(newProcedimento));
      }
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async updateProcedimento(req, res) {
    try {
      await Procedimentos.updateOne(req.params, { $set: req.body });
      res.send(defaultResponse({}, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async delete(req, res) {
    try {
      const response = await Procedimentos.deleteOne(req.params);
      res.send(defaultResponse(response.nModified, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
}

module.exports = new ProcedimentosController();
