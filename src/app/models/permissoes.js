const mongoose = require("../../database/database");
const { Schema } = require("../../database/database");

const PermissaoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
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

const Permissao = mongoose.model("Permissoes", PermissaoSchema);

module.exports = Permissao;
