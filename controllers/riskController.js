const asyncHandler = require('../utils/asyncHandler');
const { success, created } = require('../vue/response');
const riskService = require('../services/riskService');
const actionService = require('../services/actionService');

exports.list = asyncHandler(async (req, res) => {
  const data = await riskService.listRisks(req.query);
  return success(res, data);
});

exports.get = asyncHandler(async (req, res) => {
  const data = await riskService.getRisk(req.params.id);
  return success(res, data);
});

exports.create = asyncHandler(async (req, res) => {
  const data = await riskService.createRisk(req.body);
  return created(res, data, 'Risque créé');
});

exports.update = asyncHandler(async (req, res) => {
  const data = await riskService.updateRisk(req.params.id, req.body);
  return success(res, data, 'Risque mis à jour');
});

exports.resolve = asyncHandler(async (req, res) => {
  const data = await riskService.resolveRisk(req.params.id);
  return success(res, data, 'Risque marqué comme résolu');
});

exports.close = asyncHandler(async (req, res) => {
  const data = await riskService.closeRisk(req.params.id);
  return success(res, data, 'Risque clôturé');
});

exports.listActions = asyncHandler(async (req, res) => {
  const data = await actionService.listActions(req.params.riskId);
  return success(res, data);
});

exports.createAction = asyncHandler(async (req, res) => {
  const data = await actionService.createAction(req.params.riskId, req.body);
  return created(res, data, 'Action corrective créée');
});
