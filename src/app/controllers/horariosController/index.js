const httpStatus = require('http-status');
const toObjectId = require('../../../database/database').Types.ObjectId;
const {
  defaultResponse,
  errorResponse,
} = require('../../../utils/responseControllers');
const Horarios = require('../../models/horarios');
const dadosAgendamento = require('../../models/dadosAgendamento');
const gerarHorarios = require('../../../utils/gerarHorarios');
const getHorariosSetor = require('../../../utils/getHorariosSetor');
const {
  addHours,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  subHours,
} = require('date-fns');

class HorariosController {
  async verAcesso(req, res) {
    res.send(defaultResponse('Acesso gerantido'));
  }
  async getHorarioLivre(req, res) {
    const { setor } = req.params;
    const { nextHour } = req.query;

    let horario = '0:00';
    if (nextHour) {
      horario = nextHour;
    }
    try {
      const horarios = await Horarios.aggregate([
        { $match: { setor: toObjectId(setor) } },
        { $unwind: '$periodo' },
        {
          $addFields: {
            data: {
              $dateFromString: {
                dateString: {
                  $concat: ['$periodo.data', 'T', '$periodo.horaInicio'],
                },
                format: '%d/%m/%YT%H:%M',
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
            'periodo.ocupado': false,
            'periodo.ativo': true,
            data: {
              $gte: new Date(horario),
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            periodo: { $push: '$periodo' },
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
        sala: toObjectId(sala),
        'periodo.ativo': true,
      });

      res.send(defaultResponse(response));
    } catch (error) {
      res.send(errorResponse(error));
    }
  }
  async desativarHorario(req, res) {
    const { id } = req.params;
    try {
      await Horarios.findOneAndUpdate(
        { 'periodo.id': id },
        { $set: { 'periodo.$.ativo': false } }
      );
      res.send(defaultResponse({}, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error.message));
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
      return res.send(errorResponse('Nenhum periodo gerado'));
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
            'periodo.id': horario,
          },
          { $set: { 'periodo.$.ocupado': ocupado } }
        );
      });

      res.send(defaultResponse({}, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error.message));
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
      await Horarios.findOneAndUpdate(
        { 'periodo.id': id },
        { $set: { 'periodo.$.ativo': false } }
      );
      res.send(defaultResponse({}, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  async horariosSetor(req, res) {
    try {
      const horarios = await getHorariosSetor.Horarios(req.body);
      res.send(defaultResponse(horarios));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async examesComHorario(req, res) {
    try {
      const exames = await getHorariosSetor.getExamsWithHorary(req.body);
      res.send(defaultResponse(exames));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  // Dados agendamento Model
  async storeAgendamento(req, res) {
    try {
      const response = await dadosAgendamento.create(req.body);
      res.send(defaultResponse(response));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async getAgendamentoPaciente(req, res) {
    try {
      const { paciente } = req.params;
      const pacienteAgendamnentos = await dadosAgendamento.aggregate([
        { $match: { paciente: toObjectId(paciente) } },
        { $unwind: '$dados' },
        {
          $addFields: {
            'dados.hora.time': {
              $dateFromString: {
                dateString: {
                  $concat: [
                    '$dados.horario.data',
                    'T',
                    '$dados.horario.horaInicio',
                  ],
                },
                format: '%d/%m/%YT%H:%M',
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            dados: 1,
          },
        },
        {
          $sort: { 'dados.horario.data': 1, 'dados.horario.horaInicio': 1 },
        },
        {
          $group: {
            _id: '$paciente',
            dados: { $push: '$dados' },
          },
        },
      ]);

      let agendamentos = [];
      const today = subHours(new Date(), 3);
      if (pacienteAgendamnentos.length) {
        pacienteAgendamnentos[0].dados.forEach((a) => {
          const horaAgendamento = a.hora.time;
          const diff = differenceInDays(today, horaAgendamento);
          const difHora = differenceInHours(today, horaAgendamento);
          const difMinu = differenceInMinutes(today, horaAgendamento);

          if (diff <= 0) {
            if (difHora <= -0 && difMinu <= -0) {
              agendamentos.push(a);
            }
          }
        });
      }

      res.send(defaultResponse(agendamentos));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async cancelAgendamento(req, res) {
    const { horario } = req.body;
    try {
      await dadosAgendamento.updateOne(
        { 'dados.horario.id': horario },
        {
          $pull: { dados: { 'horario.id': horario } },
        },

        { multi: true }
      );
      const response = await dadosAgendamento.deleteMany({ dados: [] });

      res.send(defaultResponse(response, httpStatus.NO_CONTENT));
    } catch (error) {
      console.log(error.message);
      res.send(errorResponse(error.message));
    }
  }
  async getAgendamentos(req, res) {
    try {
      const response = await dadosAgendamento.aggregate([
        { $unwind: '$dados' },
        {
          $addFields: {
            data: {
              $dateFromString: {
                dateString: {
                  $concat: [
                    '$dados.horario.data',
                    'T',
                    '$dados.horario.horaInicio',
                  ],
                },
                format: '%d/%m/%YT%H:%M',
              },
            },
          },
        },
        {
          $lookup: {
            from: 'horarios',
            localField: 'dados.horario.id',
            foreignField: 'periodo.id',
            as: 'sala',
          },
        },
        {
          $lookup: {
            from: 'salas',
            localField: 'sala.sala',
            foreignField: '_id',
            as: 'sala',
          },
        },
        { $unwind: '$sala' },

        {
          $lookup: {
            from: 'users',
            localField: 'paciente',
            foreignField: '_id',
            as: 'paciente',
          },
        },
        { $unwind: '$paciente' },
        { $sort: { data: 1 } },
        {
          $project: {
            'paciente.name': 1,
            'sala.name': 1,
            'sala._id': 1,
            'dados.exame.name': 1,
            'dados.horario.horaInicio': 1,
            'dados.horario.data': 1,
          },
        },
      ]);

      res.send(defaultResponse(response));
    } catch (error) {
      console.log(error);
      res.send(errorResponse(error.message));
    }
  }
}

module.exports = new HorariosController();
