module.exports = {
  isUser: function (req, res, next) {
    const paciente = req.user.sub.split('|');
    if (paciente[0] !== 'auth0') {
      var err = new Error();
      err.status = 401;
      next(err);
    } else {
      next();
    }
  },
};
