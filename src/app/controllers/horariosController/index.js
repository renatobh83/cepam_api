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

class HorariosController {
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
      const agendamento = await dadosAgendamento.find(req.params);
      // res.send(defaultResponse(agendamento));
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

      console.log(pacienteAgendamnentos);
      res.send(defaultResponse(pacienteAgendamnentos));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async cancelAgendamento(req, res) {
    try {
      const { id } = req.params;
      await DadosAgendamento.deleteOne({
        'dados.hora.id': id,
      });
      res.send(defaultResponse({}, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
}

module.exports = new HorariosController();
