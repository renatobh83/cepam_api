const report = require('express').Router();
const reportController = require('../app/controllers/reportController');
const verifyToken = require('../middlewares/verifyToken');
const { check } = require('../middlewares/permissao');

report.get('/api/reports', reportController.index);

module.exports = report;
