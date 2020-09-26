const httpStatus = require("http-status");
const {
  defaultResponse,
  errorResponse,
} = require("../../../utils/responseControllers");
const Horarios = require("../../models/horarios");
const gerarHorarios = require("../../../utils/gerarHorarios");

class HorariosController {
  async store(req, res) {
    const {
      dataInicio,
      dataFim,
      intervalo,
      daysWeek,
      t1,
      t2,
      idSala,
      setor,
    } = req.body;

    const values = {
      start: dataInicio,
      end: dataFim,
      intervalo,
      daysWeek,
      t1,
      t2,
    };
    console.log(req.body);

    const horas = gerarHorarios(values);
    if (horas.length === 0) {
      return res.send(erroResponse("Nenhum periodo gerado"));
    }
    try {
      const response = await Horarios.create({
        sala: idSala,
        periodo: horas,
        setor,
      });

      res.send(defaultResponse(response, httpStatus.CREATED));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
}

module.exports = new HorariosController();
