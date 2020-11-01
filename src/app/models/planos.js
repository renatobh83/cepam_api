const mongoose = require('../../database/database');
const { Schema } = require('../../database/database');

const planosSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      trim: true,
    },
    tabela: {
      type: Schema.Types.ObjectId,
      ref: 'Tabelas',
    },
    particular: {
      type: Boolean,
      default: false,
    },
    ativo: {
      type: Boolean,
      default: true,
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
      w: 'majority',
      j: true,
      wtimeout: 1000,
    },
  }
);
planosSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: Date.now() - 3 * 60 * 60 * 1000 });
  next();
});
const Planos = mongoose.model('Planos', planosSchema);

module.exports = Planos;
