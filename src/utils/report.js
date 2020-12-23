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
            $match: { data: { $gte: inicioMes, $lte: fimMes } },
          },

          { $group: { _id: '$setor.name', count: { $sum: 1 } } },
          // { $project: { '_id.name': 1, count: 1 } },
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
      const TotalexamesAgendado = async () => {
        const fimMes = endDayMonth(dataAtual);
        const response = await DadosAgendamento.aggregate([
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
            $match: { data: { $gte: inicioMes, $lte: fimMes } },
          },

          { $group: { _id: '$setor.name', count: { $sum: 1 } } },
        ]);
        return response;
      };
      const examesAgendado = () => {
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
          { $match: { data: { $gte: inicioMes, $lte: fimMes } } },

          {
            $group: {
              _id: '$dados.exame.name',
              count: { $sum: 1 },
            },
          },
        ]);
        return response;
      };
      const agendadoPlano = () => {
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
          { $match: { data: { $gte: inicioMes, $lte: fimMes } } },
          {
            $lookup: {
              from: 'planos',
              localField: 'plano',
              foreignField: '_id',
              as: 'plano',
            },
          },
          { $unwind: '$plano' },
          {
            $group: {
              _id: '$plano.name',
              count: { $sum: 1 },
            },
          },
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
          { $group: { _id: '$setor.name', count: { $sum: 1 } } },
        ]);

        return response;
      };
      const totalSetor = async () => {
        const totalHorarios = await totalHorarioMes();
        const totalAgendamento = await TotalexamesAgendado();

        let horarioSetor = [];
        totalHorarios.forEach((nome) => {
          totalAgendamento.forEach((horario) => {
            if (horario._id === nome._id) {
              horarioSetor.push([horario._id, nome.count, horario.count]);
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

      const horariosPeriodo = async () => {
        const response = await horarios.aggregate([
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
            $group: {
              _id: { $month: '$data' },

              totalHorarios: { $sum: 1 },
            },
          },
        ]);
        return response;
      };

      const agendamentoPeriodo = async () => {
        const response = await DadosAgendamento.aggregate([
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
          { $group: { _id: { $month: '$data' }, totalAgendados: { $sum: 1 } } },
        ]);
        return response;
      };
      const horarioVsAgendaPeriodo = async () => {
        let total = [];
        const tHorario = await horariosPeriodo();
        const tAgendamento = await agendamentoPeriodo();
        if (tHorario.length > 0) {
          tHorario.forEach((horario) => {
            tAgendamento.forEach((agendamento) => {
              if (horario._id === agendamento._id) {
                total.push({
                  mes: horario._id,
                  horarios: horario.totalHorarios,
                  agendados: agendamento.totalAgendados,
                });
              }
            });
          });
        }
        console.log(total);
        return total;
      };
      const taxaOcupacao = async () => {
        let taxaPorSetor = [];
        const totalHorarios = await totalHorarioMes();
        const totalAgendamento = await TotalexamesAgendado();

        if (totalHorarios.length > 0 && totalAgendamento.length > 0) {
          totalHorarios.map((a) => {
            totalAgendamento.some((b) => {
              if (b._id === a._id) {
                let tx = (b.count / a.count) * 100;
                taxaPorSetor.push({
                  setor: b._id,
                  taxa: tx.toFixed(2),
                });
              }
            });
          });
          return taxaPorSetor;
        } else {
          return taxaPorSetor;
        }
      };

      const taxaOcupacaoGeral = async () => {
        let horarios = 0;
        let agendados = 0;
        const totalHorarios = await totalHorarioMes();
        const totalAgendamento = await TotalexamesAgendado();

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

        return tx.toFixed(2);
      };
      const [
        setorMes,
        totalMes,
        exames,
        // totalExames,
        agendadoPorPlano,
        horarioMes,
        agendadoMesAgent,
        agendadoDia,
        txOcupacao,
        txOcupacaoGeral,
        totalsetor,
        agendamentoDayFun,
        hvsAperiodo,
      ] = await Promise.all([
        totalAgendadosMes(),
        totalMesAgendamento(),
        examesAgendado(),
        // TotalexamesAgendado(),
        agendadoPlano(),
        totalHorarioMes(),
        totalAgendadosMesFuncionario(),
        totalagandadodia(),
        taxaOcupacao(),
        taxaOcupacaoGeral(),
        totalSetor(),
        totalMesFunDay(),
        horarioVsAgendaPeriodo(),
      ]);
      let report = {};
      report.detalhesAgendadoMes = setorMes;
      report.mesAgendamentos = totalMes;
      report.ExamesAgendado = exames;
      report.agendadoPlano = agendadoPorPlano;
      report.TaxaOcupacao = txOcupacao;
      report.TaxaOcupacaoGeral = txOcupacaoGeral;
      report.HorarioXAgendamento = totalsetor;
      report.Periodo = hvsAperiodo;

      // report.totalExames = totalExames;
      // report.HorariosMes = horarioMes;
      // report.AgendamentoFuncinarios = agendadoMesAgent;
      // report.AgendamentoDia = agendadoDia;
      // report.AgendamentoMesFuncionario = agendamentoDayFun;

      return report;
    } catch (error) {
      return error;
    }
  },
};
