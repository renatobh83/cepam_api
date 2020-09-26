const mongoose = require("../../database/database");
const Sala = require("./salas");
const SetorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
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

SetorSchema.pre("deleteOne", function (next) {
  const self = this;
  const id = self._conditions._id;

  Sala.findOne({ setor: id }).then((response) => {
    if (response)
      return next(
        Error(
          "Setor não pode ser excluído pois já este associado a uma sala de atendimento, por favor remova a associação para ser excluído"
        )
      );
    next();
  });
});

const Setor = mongoose.model("Setor", SetorSchema);

module.exports = Setor;
