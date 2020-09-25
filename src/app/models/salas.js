const mongoose = require("../../database/database");
const { Schema } = require("../../database/database");

const SalaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },
    setor: {
      type: Schema.Types.ObjectId,
      ref: "Setor",
      required: true,
    },
    ativo: {
      type: Boolean,
      default: true,
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

const Sala = mongoose.model("Sala", SalaSchema);

module.exports = Sala;
