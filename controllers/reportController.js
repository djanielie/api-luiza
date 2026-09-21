const asyncHandler = require('../utils/asyncHandler');
const { success, created } = require('../vue/response');
const reportService = require('../services/reportService');
const riskService = require('../services/riskService');

exports.list = asyncHandler(async (req, res) => {
  const data = await reportService.listReports(req.query);
  return success(res, data);
});

exports.get = asyncHandler(async (req, res) => {
  const data = await reportService.getReport(req.params.id);
  return success(res, data);
});

exports.create = asyncHandler(async (req, res) => {
  const data = await reportService.createReport(req.body);
  return created(res, data, 'Signalement créé');
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const data = await reportService.updateReportStatus(req.params.id, req.body.status);
  return success(res, data, 'Statut du signalement mis à jour');
});

exports.convertToRisk = asyncHandler(async (req, res) => {
  const data = await riskService.convertReportToRisk(req.params.id, req.body);
  return created(res, data, 'Signalement converti en risque');
});
