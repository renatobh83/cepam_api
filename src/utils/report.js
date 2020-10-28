const { startOfMonth, endOfMonth, addMonths, subMonths } = require('date-fns');
const DadosAgendamento = require('../app/models/dadosAgendamento');
const horarios = require('../app/models/horarios');

const firstDayMonth = (date) => {
  return startOfMonth(date);
};
const endDayMonth = (date) => {
  return endOfMonth(date);
};

module.exports = {
  async relatorios(params) {
    let dataAtual = new Date();
    if (params !== undefined) {
      dataAtual = new Date(params);
    }

    const inicioMes = firstDayMonth(dataAtual);
    try {
      const totalAgendadosMes = () => {
        const fimMes = endDayMonth(dataAtual);
        const response = DadosAgendamento.aggregate([
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
              setor: { $toObjectId: '$dados.exame.setor' },
            },
          },
          {
            $lookup: {
              from: 'setors',
              localField: 'setor',
              foreignField: '_id',
              as: 'setor',
            },
          },
          {
            $unwind: '$setor',
          },
          {
            $match: { data: { $gt: inicioMes, $lt: fimMes } },
          },

          { $group: { _id: '$setor', count: { $sum: 1 } } },
          { $project: { '_id.name': 1, count: 1 } },
        ]);
        return response;
      };
      const totalMesAgendamento = () => {
        const fimMes = endDayMonth(dataAtual);
        const response = DadosAgendamento.aggregate([
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
            $match: { data: { $gt: inicioMes, $lt: fimMes } },
          },
          { $group: { _id: null, count: { $sum: 1 } } },
          { $project: { _id: 0 } },
        ]);
        return response;
      };
      const examesAgendado = () => {
        const response = DadosAgendamento.aggregate([
          { $unwind: '$dados' },
          {
            $addFields: {
              data: {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      '$dados.hora.data',
                      'T',
                      '$dados.hora.horaInicio',
                    ],
                  },
                  format: '%d/%m/%YT%H:%M',
                },
              },
              // setor: { $toObjectId: "$dados.exame.exame.setor" },
            },
          },

          // {
          //   $unwind: "$setor",
          // },
          { $match: { data: { $gte: inicioMes } } },

          {
            $group: {
              _id: '$dados.exame.exame.procedimento',
              count: { $sum: 1 },
            },
          },
          // { $project: { "_id.nome": 1, count: 1 } },
        ]);

        return response;
      };

      const totalHorarioMes = async () => {
        const fimMes = endDayMonth(dataAtual);
        const response = await horarios.aggregate([
          { $unwind: '$periodo' },

          {
            $lookup: {
              from: 'setors',
              localField: 'setor',
              foreignField: '_id',
              as: 'setor',
            },
          },
          {
            $unwind: '$setor',
          },
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
          { $match: { data: { $gte: inicioMes, $lte: fimMes } } },
          { $group: { _id: '$setor', count: { $sum: 1 } } },
          { $project: { '_id.nome': 1, count: 1 } },
        ]);

        return response;
      };
      const totalSetor = async () => {
        const totalHorarios = await totalHorarioMes();
        const totalAgendamento = await totalAgendadosMes();
        let horarioSetor = [];
        totalHorarios.forEach((nome) => {
          totalAgendamento.forEach((horario) => {
            if (horario._id.nome === nome._id.nome) {
              horarioSetor.push([
                horario._id.nome,
                nome.count,
                horario.count,
                horario.count,
              ]);
            }
          });
        });
        return horarioSetor;
      };

      const totalAgendadosMesFuncionario = () => {
        const fimMes = endDayMonth(dataAtual);
        const response = DadosAgendamento.aggregate([
          { $unwind: '$dados' },
          {
            $addFields: {
              data: {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      '$dados.hora.data',
                      'T',
                      '$dados.hora.horaInicio',
                    ],
                  },
                  format: '%d/%m/%YT%H:%M',
                },
              },
            },
          },
          { $match: { createdAt: { $gte: inicioMes, $lte: fimMes } } },
          { $group: { _id: '$agent', count: { $sum: 1 } } },
        ]);

        return response;
      };
      const totalMesFunDay = () => {
        const fimMes = endDayMonth(dataAtual);
        const response = DadosAgendamento.aggregate([
          { $unwind: '$dados' },
          {
            $addFields: {
              data: {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      '$dados.hora.data',
                      'T',
                      '$dados.hora.horaInicio',
                    ],
                  },
                  format: '%d/%m/%YT%H:%M',
                },
              },
              agendadoem: { $substr: ['$createdAt', 0, 10] },
            },
          },
          { $match: { createdAt: { $gte: inicioMes, $lte: fimMes } } },
          { $sort: { createdAt: 1 } },
          {
            $group: {
              _id: { ag: '$agent', dt: '$agendadoem' },
              count: { $sum: 1 },
            },
          },
        ]);

        return response;
      };
      const totalagandadodia = () => {
        const dataInicio = new Date();
        const dataFim = new Date();

        dataInicio.setHours(0);
        const response = DadosAgendamento.aggregate([
          // { $match: req.params },
          { $unwind: '$dados' },
          {
            $addFields: {
              data: {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      '$dados.hora.data',
                      'T',
                      '$dados.hora.horaInicio',
                    ],
                  },
                  format: '%d/%m/%YT%H:%M',
                },
              },
            },
          },
          { $match: { createdAt: { $gte: dataInicio, $lte: dataFim } } },
          { $group: { _id: '$agent', count: { $sum: 1 } } },
        ]);
        return response;
      };

      const taxaOcupacao = async () => {
        let horarios = 0;
        let agendados = 0;
        const totalHorarios = await totalHorarioMes();
        const totalAgendamento = await totalAgendadosMes();

        totalHorarios.length > 0
          ? totalHorarios.forEach((horario) => (horarios += horario.count))
          : horarios;
        totalAgendamento.length > 0
          ? totalAgendamento.forEach(
              (agendado) => (agendados += agendado.count)
            )
          : agendados;
        let tx;
        if (horarios !== 0) {
          tx = (agendados / horarios) * 100;
        } else {
          tx = 0;
        }

        return `${tx.toFixed(2)}%`;
      };
      const [
        setorMes,
        totalMes,
        horarioMes,
        agendadoMesAgent,
        agendadoDia,
        txOcupacao,
        exames,
        totalsetor,
        agendamentoDayFun,
      ] = await Promise.all([
        totalAgendadosMes(),
        totalMesAgendamento(),
        totalHorarioMes(),
        totalAgendadosMesFuncionario(),
        totalagandadodia(),
        taxaOcupacao(),
        examesAgendado(),
        totalSetor(),
        totalMesFunDay(),
      ]);
      let report = {};
      report.detalhesAgendadoMes = setorMes;
      report.mesAgendamentos = totalMes;
      // report.HorariosMes = horarioMes;
      // report.AgendamentoFuncinarios = agendadoMesAgent;
      // report.AgendamentoDia = agendadoDia;
      // report.ExamesAgendado = exames;
      // report.TaxaOcupacao = txOcupacao;
      // report.TaxaHorarioAgendamento = totalsetor;
      // report.AgendamentoMesFuncionario = agendamentoDayFun;

      return report;
    } catch (error) {
      return error;
    }
  },
};
