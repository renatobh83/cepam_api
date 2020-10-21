const httpStatus = require('http-status');
const {
  defaultResponse,
  errorResponse,
} = require('../../../utils/responseControllers');
const User = require('../../models/users');
class UsersController {
  async indexUsers(req, res) {
    try {
      const users = await User.find({
        $or: [{ paciente: false }, { paciente: null }],
      });
      res.send(defaultResponse(users));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async findUser(req, res) {
    try {
      const user = await User.findOne(req.body);
      res.send(defaultResponse(user));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async store(req, res) {
    try {
      const userExist = await User.findOne({ email: req.body.email });
      if (userExist) {
        res.send(defaultResponse(userExist));
      } else {
        const newUser = await User.create(req.body);

        res.send(defaultResponse(newUser));
      }
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async UpdateUserPatient(req, res) {
    try {
      const update = await User.updateOne(req.params, { $set: req.body });

      res.send(defaultResponse(update, httpStatus.NO_CONTENT));
    } catch (error) {
      console.log(error);
      res.send(errorResponse(error.message));
    }
  }
  async deactiveOrActive(req, res) {
    try {
      const response = await User.updateOne(req.query, {
        $set: { ativo: req.body.ativo },
      });
      res.send(defaultResponse(response.nModified, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  // pacientes
  async indexPacientes(req, res) {
    try {
      const pacientes = await User.find({
        $and: [{ ativo: true }, { paciente: true }],
      }).limit(20);
      res.send(defaultResponse(pacientes));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  async storePaciente(req, res) {
    try {
      const findPaciente = await User.findOne(req.body);
      if (findPaciente) {
        res.send(defaultResponse(findPaciente));
      } else {
        const paciente = await User.create(req.body);

        res.send(defaultResponse(paciente));
      }
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  // login
  async loginUser(req, res) {
    try {
      const user = await User.findOne({
        $or: [{ nickname: req.user.nickname }, { email: req.user.email }],
      });

      if (user === null) {
        const paciente = req.user.sub.split('|');
        if (paciente[0] !== 'auth0') {
          const newUser = new User(req.user);
          newUser.paciente = true;
          newUser.save();
          return res.send(defaultResponse(newUser));
        }
      }

      res.send(defaultResponse(user));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
}

module.exports = new UsersController();
