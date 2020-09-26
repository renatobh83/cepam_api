const mongoose = require("../../database/database");
const { Schema } = require("../../database/database");

const DadosAgendamentoSchema = new mongoose.Schema(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    dados: [
      {
        type: Object,
      },
    ],
    agent: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now() - 3 * 60 * 60 * 1000,
    },
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  }
);

const DadosAgendamento = mongoose.model(
  "DadosAgendamento",
  DadosAgendamentoSchema
);

module.exports = DadosAgendamento;
