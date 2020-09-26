const mongoose = require("../../database/database");
const { Schema } = require("../../database/database");

const GruposSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },
    permissaoId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permissao",
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
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  }
);

const Grupos = mongoose.model("Grupos", GruposSchema);

module.exports = Grupos;
