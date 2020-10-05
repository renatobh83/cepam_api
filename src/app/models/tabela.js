const mongoose = require('../../database/database');

const TabelaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      trim: true,
    },
    exames: [
      {
        type: Object,
      },
    ],
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
      w: 'majority',
      j: true,
      wtimeout: 1000,
    },
  }
);

const Tabela = mongoose.model('Tabela', TabelaSchema);

module.exports = Tabela;
