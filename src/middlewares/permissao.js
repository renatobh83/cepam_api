const User = require('../app/models/users');
const Grupos = require('../app/models/grupos');
const Permissao = require('../app/models/permissoes');

module.exports = {
  check: function (req, res, next) {
    User.findOne({ email: req.user.email }).then(async (response) => {
      if (!response.paciente) {
        const idPermissao = await Permissao.findOne(
          { name: req.path.split('/')[2].toUpperCase() },
          { _id: 1 }
        );
        const grupo = await Grupos.findOne(
          { _id: response.grupoId },
          { permissaoId: 1, _id: 0 }
        );
        console.log(req.path.split('/'), grupo, idPermissao);

        if (
          grupo.permissaoId.includes(idPermissao !== null ? idPermissao._id : 0)
        ) {
          return next();
        } else {
          var err = new Error();
          err.status = 401;
          next(err);
        }
      } else {
        var err = new Error();
        err.status = 401;
        next(err);
      }
    });
  },
};
