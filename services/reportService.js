const { sequelize, Site, Report, Attachment, User } = require('../modele');
const AppError = require('../utils/AppError');
const { nextCode } = require('./sequenceService');
const { dateRange } = require('./siteService');

async function assertSite(siteId, transaction) {
  const site = await Site.findByPk(siteId, { transaction });
  if (!site) throw new AppError(404, 'NOT_FOUND', 'Site introuvable');
  return site;
}

async function listReports(query) {
  const where = {};
  if (query.siteId) where.siteId = query.siteId;
  if (query.type) where.type = query.type;
  if (query.status) where.status = query.status;
  const range = dateRange(query.from, query.to);
  if (range) where.reportDate = range;

  return Report.findAll({
    where,
    include: [
      { model: Site, as: 'site' },
      { model: User, as: 'reporter' },
      { model: Attachment, as: 'attachments' },
    ],
    order: [['reportDate', 'DESC']],
  });
}

async function getReport(id) {
  const report = await Report.findByPk(id, {
    include: [
      { model: Site, as: 'site' },
      { model: User, as: 'reporter' },
      { model: Attachment, as: 'attachments' },
      'risks',
      'alerts',
    ],
  });
  if (!report) throw new AppError(404, 'NOT_FOUND', 'Signalement introuvable');
  return report;
}

async function createReport(payload) {
  return sequelize.transaction(async (transaction) => {
    await assertSite(payload.siteId, transaction);
    if (payload.reporterId) {
      const reporter = await User.findByPk(payload.reporterId, { transaction });
      if (!reporter) throw new AppError(404, 'NOT_FOUND', 'Utilisateur introuvable');
    }
    const code = await nextCode('REP', transaction);
    return Report.create({
      ...payload,
      code,
      reportDate: payload.reportDate || new Date(),
      status: 'RECEIVED',
    }, { transaction });
  });
}

async function updateReportStatus(id, status) {
  const report = await Report.findByPk(id);
  if (!report) throw new AppError(404, 'NOT_FOUND', 'Signalement introuvable');
  await report.update({ status });
  return report;
}

module.exports = {
  listReports,
  getReport,
  createReport,
  updateReportStatus,
  assertSite,
};
