const httpStatus = require("http-status");
const {
  defaultResponse,
  errorResponse,
} = require("../../../utils/responseControllers");
const Permissoes = require("../../models/permissoes");
const Grupos = require("../../models/grupos");
class PermissaoController {
  async index(req, res) {
    try {
      const permissoes = await Permissoes.find({});
      res.send(defaultResponse(permissoes));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  async store(req, res) {
    try {
      const permissaoExist = await Permissoes.findOne({ name: req.body.name });
      if (permissaoExist) {
        res.send(defaultResponse(permissaoExist));
      } else {
        const newPermission = await Permissoes.create(req.body);
        res.send(defaultResponse(newPermission));
      }
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }

  async delete(req, res) {
    try {
      const permissao = await Permissoes.deleteOne(req.params);
      res.send(defaultResponse(permissao, httpStatus.NO_CONTENT));
    } catch (error) {
      res.send(errorResponse(error));
    }
  }
  async includeGrupo(req, res) {
    try {
      const { checkedPermissao: permissoes, grupo } = req.body;
      const grupoAddPermission = await Grupos.findById(grupo);
      grupoAddPermission.permissaoId = permissoes;
      await grupoAddPermission.save();
      res.send(defaultResponse("Permissao Liberada"));
    } catch (error) {
      res.send(erroResponse(error.message));
    }
  }
}

module.exports = new PermissaoController();
