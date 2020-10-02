const httpStatus = require('http-status');
const {
  defaultResponse,
  errorResponse,
} = require('../../../utils/responseControllers');
const Planos = require('../../models/planos');

class PlanosController {
  async index(req, res) {
    try {
      const planos = await Planos.find({});
      res.send(defaultResponse(planos));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  async store(req, res) {
    try {
      const planoExist = await Planos.findOne({ name: req.body.name });
      if (planoExist) {
        res.send(defaultResponse(planoExist));
      } else {
        const newPlano = await Planos.create(req.body);
        res.send(defaultResponse(newPlano));
      }
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  async delete(req, res) {
    try {
      const response = await Planos.deleteOne(req.params);
      res.send(defaultResponse(response.nModified, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
}

module.exports = new PlanosController();
