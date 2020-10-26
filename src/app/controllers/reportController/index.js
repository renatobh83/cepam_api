const httpStatus = require('http-status');
const report = require('../../../utils/report');
const {
  defaultResponse,
  errorResponse,
} = require('../../../utils/responseControllers');
class ReportController {
  async index(req, res) {
    const data = req.query.data;
    try {
      const reportResponse = await report.relatorios(data);
      res.send(defaultResponse(reportResponse));
    } catch (error) {
      res.send(errorResponse(error.message));
    }
  }
}

module.exports = new ReportController();
