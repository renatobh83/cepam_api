const { startOfMonth, endOfMonth, startOfDay, endOfDay } = require('date-fns');
const DadosAgendamento = require('../app/models/dadosAgendamento');

const firstDayMonth = (date) => {
  return startOfMonth(date);
};
const endDayMonth = (date) => {
  return endOfMonth(date);
};
module.exports = {
  async infoDash() {
    const userinfoMes = async () => {
      let dataAtual = new Date();
      const inicioMes = firstDayMonth(dataAtual);
      const fimMes = endDayMonth(dataAtual);
      try {
        const response = DadosAgendamento.aggregate([
          { $match: { createdAt: { $gte: inicioMes, $lte: fimMes } } },
          { $sort: { createdAt: 1 } },
          {
            $group: {
              _id: { ag: '$agent' },
              count: { $sum: 1 },
            },
          },
        ]);
        return response;
      } catch (error) {}
    };
    const userInfoDay = async () => {
      const diaInicio = startOfDay(new Date());
      const fimDia = endOfDay(new Date());
      try {
        const response = DadosAgendamento.aggregate([
          { $match: { createdAt: { $gte: diaInicio, $lte: fimDia } } },
          { $sort: { createdAt: 1 } },
          {
            $group: {
              _id: { ag: '$agent' },
              count: { $sum: 1 },
            },
          },
        ]);
        return response;
      } catch (error) {}
    };
    const [dashMes, dashDay] = await Promise.all([
      userinfoMes(),
      userInfoDay(),
    ]);
    let result = {};
    result.mesAgendamento = dashMes;
    result.diaAgendamento = dashDay;

    return result;
  },
};
