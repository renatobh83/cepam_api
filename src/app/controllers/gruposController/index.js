const httpStatus = require("http-status");
const {
  defaultResponse,
  errorResponse,
} = require("../../../utils/responseControllers");
const Grupos = require("../../models/grupos");
class GrupoController {
  async indexGrupos(req, res) {
    try {
      const grupos = await Grupos.find({});
      res.send(defaultResponse(grupos));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  async findGrupo(req, res) {
    try {
      const grupo = await Grupos.findOne(req.params, {
        permissaoId: 1,
        _id: 0,
      });
      res.send(defaultResponse(grupo));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  async store(req, res) {
    try {
      const grupoExist = await Grupos.findOne({ name: req.body.name });
      if (grupoExist) {
        res.send(defaultResponse(grupoExist));
      } else {
        const newGrupo = await Grupos.create(req.body);
        res.send(defaultResponse(newGrupo));
      }
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
  async updateGrupo(req, res) {
    try {
      const grupoUpdated = await Grupos.updateOne(req.params, {
        $set: req.body,
      });
      res.send(defaultResponse(grupoUpdated.nModified, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error));
    }
  }

  async delete(req, res) {
    try {
      const grupoDeleted = await Grupos.deleteOne(req.params);
      res.send(defaultResponse(grupoDeleted, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error));
    }
  }
}

module.exports = new GrupoController();
