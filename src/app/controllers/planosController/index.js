const httpStatus = require("http-status");
const toObjectId = require("../../../database/database").Types.ObjectId;
const {
  defaultResponse,
  errorResponse,
} = require("../../../utils/responseControllers");
const Planos = require("../../models/planos");

class PlanosController {
  async index(req, res) {
    try {
      const planos = await Planos.find({});

      res.send(defaultResponse(planos));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async indexAgendamento(req, res) {
    try {
      const planos = await Planos.find({});

      res.send(defaultResponse(planos));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  async store(req, res) {
    try {
      const planoExist = await Planos.findOne(req.body);
      if (planoExist) {
        res.send(defaultResponse({}, httpStatus.CONFLICT));
      } else {
        const newPlano = await Planos.create(req.body);
        res.send(defaultResponse(newPlano));
      }
    } catch (error) {
      console.log(error);
      res.send(errorResponse(error.message));
    }
  }
  async updatePlano(req, res) {
    try {
      const a = await Planos.updateOne(req.params, { $set: req.body });

      res.send(defaultResponse({}, httpStatus.NO_CONTENT));
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
  async getExamePlano(req, res) {
    const { id } = req.params;
    console.log(req.params);
    try {
      const response = await Planos.aggregate([
        {
          $match: { _id: toObjectId(id) },
        },
        {
          $lookup: {
            from: "tabelas",
            localField: "tabela",
            foreignField: "_id",
            as: "ex",
          },
        },
        { $unwind: "$ex" },
      ]);

      res.send(defaultResponse(response));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
}

module.exports = new PlanosController();
