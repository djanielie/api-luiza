const asyncHandler = require('../utils/asyncHandler');
const { success, created } = require('../vue/response');
const siteService = require('../services/siteService');

exports.list = asyncHandler(async (req, res) => {
  const data = await siteService.listSites();
  return success(res, data);
});

exports.get = asyncHandler(async (req, res) => {
  const data = await siteService.getSite(req.params.id);
  return success(res, data);
});

exports.create = asyncHandler(async (req, res) => {
  const data = await siteService.createSite(req.body);
  return created(res, data, 'Site créé');
});

exports.update = asyncHandler(async (req, res) => {
  const data = await siteService.updateSite(req.params.id, req.body);
  return success(res, data, 'Site mis à jour');
});

exports.remove = asyncHandler(async (req, res) => {
  const data = await siteService.deactivateSite(req.params.id);
  return success(res, data, 'Site désactivé');
});
