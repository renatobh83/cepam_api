const httpStatus = require('http-status');
const {
  defaultResponse,
  errorResponse,
} = require('../../../utils/responseControllers');
const Setores = require('../../models/setores');

class SetoresController {
  async index(req, res) {
    try {
      const setores = await Setores.find({});
      res.send(defaultResponse(setores));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async findSetor(req, res) {
    try {
      const setor = await Setores.findOne(req.body);
      res.send(defaultResponse(setor));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async store(req, res) {
    try {
      const setorExist = await Setores.findOne({ name: req.body.name });
      if (setorExist) {
        res.send(defaultResponse(setorExist));
      } else {
        const newSetor = await Setores.create(req.body);
        res.send(defaultResponse(newSetor));
      }
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async updateSetor(req, res) {
    try {
      await Setores.updateOne(req.params, { $set: req.body });

      res.send(defaultResponse({}, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async delete(req, res) {
    try {
      await Setores.deleteOne(req.params);
      const setores = await Setores.find({});
      res.send(defaultResponse(setores));
    } catch (error) {
      res.send(erroResponse(error.message));
    }
  }
}

module.exports = new SetoresController();
