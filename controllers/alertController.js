const asyncHandler = require('../utils/asyncHandler');
const { success, created } = require('../vue/response');
const alertService = require('../services/alertService');

exports.list = asyncHandler(async (req, res) => {
  const data = await alertService.listAlerts(req.query);
  return success(res, data);
});

exports.get = asyncHandler(async (req, res) => {
  const data = await alertService.getAlert(req.params.id);
  return success(res, data);
});

exports.create = asyncHandler(async (req, res) => {
  const data = await alertService.createAlert(req.body);
  return created(res, data, 'Alerte créée');
});

exports.acknowledge = asyncHandler(async (req, res) => {
  const data = await alertService.acknowledgeAlert(req.params.id);
  return success(res, data, 'Alerte accusée de réception');
});

exports.close = asyncHandler(async (req, res) => {
  const data = await alertService.closeAlert(req.params.id);
  return success(res, data, 'Alerte clôturée');
});
