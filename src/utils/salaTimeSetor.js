const Sala = require("../app/models/salas");
const toObjectId = require("../database/database").Types.ObjectId;

module.exports = {
  async salaTempo(params) {
    try {
      const salaLookupSetor = () => {
        const response = Sala.aggregate([
          { $match: { _id: toObjectId(params._id) } },
          {
            $lookup: {
              from: "setors",
              localField: "setor",
              foreignField: "_id",
              as: "setor",
            },
          },
          { $unwind: "$setor" },
          { $project: { _id: 1, name: 1, "setor.name": 1, "setor.time": 1 } },
        ]);

        return response;
      };
      const [salatime] = await Promise.all([salaLookupSetor()]);
      let result = {};
      result.IntervaloSala = salatime;
      return result;
    } catch (error) {}
  },
};
