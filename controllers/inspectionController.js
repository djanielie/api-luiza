const asyncHandler = require('../utils/asyncHandler');
const { success, created } = require('../vue/response');
const inspectionService = require('../services/inspectionService');

exports.list = asyncHandler(async (req, res) => {
  const data = await inspectionService.listInspections(req.query);
  return success(res, data);
});

exports.get = asyncHandler(async (req, res) => {
  const data = await inspectionService.getInspection(req.params.id);
  return success(res, data);
});

exports.create = asyncHandler(async (req, res) => {
  const data = await inspectionService.createInspection(req.body);
  return created(res, data, 'Inspection créée');
});

exports.update = asyncHandler(async (req, res) => {
  const data = await inspectionService.updateInspection(req.params.id, req.body);
  return success(res, data, 'Inspection mise à jour');
});

exports.complete = asyncHandler(async (req, res) => {
  const data = await inspectionService.completeInspection(req.params.id);
  return success(res, data, 'Inspection terminée');
});

exports.addRisk = asyncHandler(async (req, res) => {
  const data = await inspectionService.addRiskToInspection(req.params.id, req.body);
  return created(res, data, 'Risque ajouté à l’inspection');
});
