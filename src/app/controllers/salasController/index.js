const {
  defaultResponse,
  errorResponse,
} = require("../../../utils/responseControllers");
const Sala = require("../../models/salas");

class SalasController {
  async index(req, res) {
    try {
      const salas = await Sala.find({});
      res.send(defaultResponse(salas));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async findSala(req, res) {
    try {
      const sala = await Sala.findOne(req.body);
      res.send(defaultResponse(sala));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  // async store(req, res) {
  //   try {
  //     const userExist = await User.findOne({ email: req.body.email });
  //     if (userExist) {
  //       res.send(defaultResponse(userExist));
  //     } else {
  //       const newUser = await User.create(req.body);
  //       res.send(defaultResponse(newUser));
  //     }
  //   } catch (error) {
  //     res.send(errorResponse(error.message));
  //   }
  // }
  // async UpdateUserPatient(req, res) {
  //   const { name, password, telefone, dtNascimento, email } = req.body;
  //   try {
  //     const update = await User.findOne(req.params);
  //     update.name = name;
  //     update.email = email;
  //     update.password = password;
  //     update.telefone = telefone;
  //     update.dtNascimento = dtNascimento;
  //     await update.save();

  //     res.send(defaultResponse(update, httpStatus.NO_CONTENT));
  //   } catch (error) {
  //     res.send(errorResponse(error.message));
  //   }
  // }
  // async deactiveOrActive(req, res) {
  //   try {
  //     const response = await User.updateOne(req.query, {
  //       $set: { ativo: req.body.ativo },
  //     });
  //     res.send(defaultResponse(response.nModified, httpStatus.NO_CONTENT));
  //   } catch (error) {
  //     res.send(errorResponse(error.message));
  //   }
  // }

  // // pacientes
  // async indexPacientes(req, res) {
  //   try {
  //     const pacientes = await User.find({
  //       $and: [{ ativo: true }, { paciente: true }],
  //     }).limit(20);
  //     res.send(defaultResponse(pacientes));
  //   } catch (error) {
  //     res.send(errorResponse(error.message));
  //   }
  // }
}

module.exports = new SalasController();
