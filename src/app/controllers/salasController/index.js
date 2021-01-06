const httpStatus = require("http-status");
const {
  defaultResponse,
  errorResponse,
} = require("../../../utils/responseControllers");
const salaTimeSetor = require("../../../utils/salaTimeSetor");
const Sala = require("../../models/salas");

class SalasController {
  async index(req, res) {

    try {
      const salas = await Sala.find({});
      res.send(defaultResponse(salas));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async findSala(req, res) {
    try {
      const sala = await Sala.findOne(req.body);
      res.send(defaultResponse(sala));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async tempoSala(req, res) {
    try {
      const intervalo = await salaTimeSetor.salaTempo(req.params);
      res.send(defaultResponse(intervalo));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async store(req, res) {
    try {
      const salaExist = await Sala.findOne({ name: req.body.name });
      if (salaExist) {
        res.send(defaultResponse(salaExist));
      } else {
        const newSala = await Sala.create(req.body);
        res.send(defaultResponse(newSala));
      }
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  async delete(req, res) {
    try {
      const response = await Sala.deleteOne(req.params);
      res.send(defaultResponse(response.nModified, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
}

module.exports = new SalasController();
