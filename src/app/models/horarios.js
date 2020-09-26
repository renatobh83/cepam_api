const mongoose = require("../../database/database");
const { Schema } = require("../../database/database");

const HorariosSchema = new mongoose.Schema(
  {
    periodo: [
      {
        type: Object,
      },
    ],
    sala: {
      type: Schema.Types.ObjectId,
      ref: "Sala",
    },
    setor: {
      type: Schema.Types.ObjectId,
      ref: "Setor",
    },
    createdAt: {
      type: Date,
      default: Date.now() - 3 * 60 * 60 * 1000,
    },
    updatedAt: {
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

const Horarios = mongoose.model("Horarios", HorariosSchema);

module.exports = Horarios;
