const { subHours } = require('date-fns/');
const { findOne } = require('../app/models/horarios');

const Horarios = require('../app/models/horarios');
const Planos = require('../app/models/planos');

const toObjectId = require('../database/database').Types.ObjectId;
module.exports = {
  async Horarios(params) {
    const { id, plano } = params;

    const agora = subHours(new Date(), 3);

    const horariosDisponivel = () => {
      const horarios = Horarios.aggregate([
        { $match: { setor: toObjectId(id) } },
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
          $match: {
            'periodo.ocupado': false,
            'periodo.ativo': true,
            data: {
              $gte: agora,
            },
          },
        },
        { $limit:50 },
        {
          $group: {
            _id: '$_id',
            periodo: { $push: '$periodo' },
          },
        },
     
        { $unwind: '$periodo' },
        { $project: { periodo: 1, _id: 0 } },
      ]);

      return horarios;
    };
    const getHorariosSetor = async () => {
      const retorno = await Horarios.aggregate([
        { $match: { setor: toObjectId(id) } },
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
          $match: {
            'periodo.ocupado': false,
            'periodo.ativo': true,
            data: {
              $gte: agora,
            },
          },
        },
        { $limit: 1 },
        { $project: { data: 1, setor: 1 } },
      ]);

      return retorno;
    };

    const [horarios, horarioSetor] = await Promise.all([
      horariosDisponivel(),
      getHorariosSetor(),
    ]);

    let result = {};
    result.horarios = horarios;
    result.setorHorario = horarioSetor;
    return result;
  },

  async getExamsWithHorary(params) {
    const agora = subHours(new Date(), 3);
    const { plano } = params;

    const examesTabela = async () => {
      const response = await Planos.aggregate([
        {
          $match: { _id: toObjectId(plano) },
        },
        {
          $lookup: {
            from: 'tabelas',
            localField: 'tabela',
            foreignField: '_id',
            as: 'ex',
          },
        },
        { $unwind: '$ex' },
        { $unwind: '$ex.exames' },
        { $project: { 'ex.exames': 1 } },
      ]);
      return response;
    };
    const horariosExames = async () => {
      const exames = await examesTabela();
      const setores = exames.map((ab) => ab.ex.exames.exame.setor);
      let arrayHorarios = [];
      for (const horarios of setores) {
        const retorno = await Horarios.aggregate([
          { $match: { setor: toObjectId(horarios) } },
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
            $match: {
              'periodo.ocupado': false,
              'periodo.ativo': true,
              data: {
                $gte: agora,
              },
            },
          },

          { $limit: 1 },
          { $project: { data: 1, setor: 1 } },
        ]);
        arrayHorarios.push(retorno);
      }

      return arrayHorarios;
    };

    const [setorHorario] = await Promise.all([horariosExames()]);
    let result = {};
    result.exames = setorHorario;
    return result;
  },
};
