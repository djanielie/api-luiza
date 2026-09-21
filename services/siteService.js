const { Op } = require('sequelize');
const { Site } = require('../modele');
const AppError = require('../utils/AppError');

async function listSites() {
  return Site.findAll({ order: [['name', 'ASC']] });
}

async function getSite(id) {
  const site = await Site.findByPk(id, {
    include: ['inspections', 'reports', 'risks', 'alerts'],
  });
  if (!site) throw new AppError(404, 'NOT_FOUND', 'Site introuvable');
  return site;
}

async function createSite(payload) {
  return Site.create(payload);
}

async function updateSite(id, payload) {
  const site = await Site.findByPk(id);
  if (!site) throw new AppError(404, 'NOT_FOUND', 'Site introuvable');
  await site.update(payload);
  return site;
}

async function deactivateSite(id) {
  const site = await Site.findByPk(id);
  if (!site) throw new AppError(404, 'NOT_FOUND', 'Site introuvable');
  await site.update({ status: 'INACTIVE' });
  return site;
}

function dateRange(from, to) {
  if (!from && !to) return undefined;
  const range = {};
  if (from) range[Op.gte] = new Date(from);
  if (to) range[Op.lte] = new Date(to);
  return range;
}

module.exports = {
  listSites,
  getSite,
  createSite,
  updateSite,
  deactivateSite,
  dateRange,
};
