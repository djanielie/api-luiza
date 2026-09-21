const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../vue/response');
const actionService = require('../services/actionService');

exports.update = asyncHandler(async (req, res) => {
  const data = await actionService.updateAction(req.params.id, req.body);
  return success(res, data, 'Action mise à jour');
});

exports.start = asyncHandler(async (req, res) => {
  const data = await actionService.startAction(req.params.id);
  return success(res, data, 'Action en cours');
});

exports.complete = asyncHandler(async (req, res) => {
  const data = await actionService.completeAction(req.params.id);
  return success(res, data, 'Action terminée');
});

exports.verify = asyncHandler(async (req, res) => {
  const data = await actionService.verifyAction(req.params.id, req.body?.verificationNotes);
  return success(res, data, 'Action vérifiée');
});
