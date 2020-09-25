const httpstatus = require("http-status");

class ResponseController {
  defaultResponse = (message, statusCode = httpstatus.OK) => ({
    message,
    statusCode,
  });
  errorResponse = (message, statusCode = httpstatus.BAD_REQUEST) => ({
    message,
    statusCode,
  });
}

module.exports = new ResponseController();
