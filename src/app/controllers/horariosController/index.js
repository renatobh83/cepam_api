const httpStatus = require("http-status");
const toObjectId = require("../../../database/database").Types.ObjectId;
const {
  defaultResponse,
  errorResponse,
} = require("../../../utils/responseControllers");
const Horarios = require("../../models/horarios");
const gerarHorarios = require("../../../utils/gerarHorarios");

class HorariosController {
  async getHorarioLivre(req, res) {
    const { setor } = req.params;
    const { nextHour } = req.query;

    let horario = "0:00";
    if (nextHour) {
      horario = nextHour;
    }
    try {
      const horarios = await Horarios.aggregate([
        { $match: { setor: toObjectId(setor) } },
        { $unwind: "$periodo" },
        {
          $addFields: {
            data: {
              $dateFromString: {
                dateString: {
                  $concat: ["$periodo.data", "T", "$periodo.horaInicio"],
                },
                format: "%d/%m/%YT%H:%M",
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            periodo: 1,
            data: 1,
          },
        },
        {
          $match: {
            "periodo.ocupado": false,
            "periodo.ativo": true,
            data: {
              $gte: new Date(horario),
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            periodo: { $push: "$periodo" },
          },
        },
      ]);

      res.send(defaultResponse(horarios));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async getHorarioBySala(req, res) {
    const { sala } = req.params;
    try {
      const response = await Horarios.find({
        salaId: ObjectId(sala),
        "periodo.ativo": true,
      });

      res.send(defaultResponse(response));
    } catch (error) {
      res.send(errorResponse(error));
    }
  }
  async store(req, res) {
    const {
      dataInicio,
      dataFim,
      intervalo,
      daysWeek,
      t1,
      t2,
      sala,
      setor,
    } = req.body;

    const values = {
      start: dataInicio,
      end: dataFim,
      intervalo,
      daysWeek,
      t1,
      t2,
    };
    const horas = gerarHorarios(values);
    if (horas.length === 0) {
      return res.send(errorResponse("Nenhum periodo gerado"));
    }
    try {
      const response = await Horarios.create({
        sala,
        periodo: horas,
        setor,
      });

      res.send(defaultResponse(response, httpStatus.CREATED));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async updateHorario(req, res) {
    const { ocupado, horarios } = req.body;
    try {
      horarios.forEach(async (horario) => {
        await Horarios.updateOne(
          {
            "periodo.id": horario,
          },
          { $set: { "periodo.$.ocupado": ocupado } }
        );
      });

      res.send(defaultResponse({}, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(erroResponse(error.message));
    }
  }
  async delelePeriodo(req, res) {
    const { deleteHorary, sala } = req.body;
    try {
      await Horarios.updateOne(
        {
          sala: sala,
        },
        {
          $pull: {
            periodo: { id: { $in: deleteHorary } },
          },
        },

        { multi: true }
      );

      res.send(defaultResponse({}, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async horarioInativo(req, res) {
    const { id } = req.params;
    try {
      const a = await Horarios.findOneAndUpdate(
        { "periodo.id": id },
        { $set: { "periodo.$.ativo": false } }
      );
      res.send(defaultResponse({}, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
}

module.exports = new HorariosController();
