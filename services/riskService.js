const {
  sequelize,
  Site,
  Report,
  Risk,
  Alert,
  CorrectiveAction,
  Attachment,
  Inspection,
} = require('../modele');
const AppError = require('../utils/AppError');
const { nextCode } = require('./sequenceService');
const { assertSite } = require('./reportService');
const { REPORT_TYPE_TO_RISK_TYPE, REPORT_TYPE_TO_ALERT_TYPE } = require('../constants/enums');
const { formatWhatsAppAlert } = require('../vue/alertMessage');

async function maybeCreateCriticalAlert({ site, risk, report, transaction }) {
  if (risk.priority !== 'CRITICAL') return null;
  const code = await nextCode('ALT', transaction);
  const message = formatWhatsAppAlert({ site, risk, report, alert: { type: 'CRITICAL_RISK', priority: 'CRITICAL', code } });
  return Alert.create({
    code,
    siteId: risk.siteId,
    reportId: risk.reportId,
    riskId: risk.id,
    type: report ? (REPORT_TYPE_TO_ALERT_TYPE[report.type] || 'CRITICAL_RISK') : 'CRITICAL_RISK',
    priority: 'CRITICAL',
    message,
    channel: 'WHATSAPP',
    status: 'CREATED',
  }, { transaction });
}

async function listRisks(query) {
  const where = {};
  if (query.siteId) where.siteId = query.siteId;
  if (query.priority) where.priority = query.priority;
  if (query.status) where.status = query.status;
  if (query.riskType) where.riskType = query.riskType;

  return Risk.findAll({
    where,
    include: [
      { model: Site, as: 'site' },
      { model: CorrectiveAction, as: 'actions' },
    ],
    order: [['identifiedAt', 'DESC']],
  });
}

async function getRisk(id) {
  const risk = await Risk.findByPk(id, {
    include: [
      { model: Site, as: 'site' },
      { model: Report, as: 'report' },
      { model: Inspection, as: 'inspection' },
      { model: CorrectiveAction, as: 'actions' },
      { model: Attachment, as: 'attachments' },
      { model: Alert, as: 'alerts' },
    ],
  });
  if (!risk) throw new AppError(404, 'NOT_FOUND', 'Risque introuvable');
  return risk;
}

async function createRisk(payload) {
  const created = await sequelize.transaction(async (transaction) => {
    const site = await assertSite(payload.siteId, transaction);
    const code = await nextCode('RISK', transaction);
    const risk = await Risk.create({
      ...payload,
      code,
      identifiedAt: payload.identifiedAt || new Date(),
      status: 'OPEN',
    }, { transaction });
    await maybeCreateCriticalAlert({ site, risk, transaction });
    return risk;
  });

  return getRisk(created.id);
}

async function updateRisk(id, payload) {
  const risk = await Risk.findByPk(id);
  if (!risk) throw new AppError(404, 'NOT_FOUND', 'Risque introuvable');
  await risk.update(payload);
  return getRisk(id);
}

async function convertReportToRisk(reportId, payload = {}) {
  const created = await sequelize.transaction(async (transaction) => {
    const report = await Report.findByPk(reportId, {
      include: [{ model: Site, as: 'site' }],
      transaction,
    });
    if (!report) throw new AppError(404, 'NOT_FOUND', 'Signalement introuvable');
    if (report.status === 'CONVERTED_TO_RISK') {
      throw new AppError(409, 'CONFLICT', 'Ce signalement a déjà été converti en risque');
    }

    const code = await nextCode('RISK', transaction);
    const risk = await Risk.create({
      siteId: report.siteId,
      reportId: report.id,
      title: payload.title || report.title,
      description: payload.description || report.description,
      riskType: payload.riskType || REPORT_TYPE_TO_RISK_TYPE[report.type] || 'OTHER',
      priority: payload.priority || 'MEDIUM',
      exposedPersons: payload.exposedPersons ?? report.peopleAffected,
      immediateMeasures: payload.immediateMeasures || report.immediateMeasures,
      identifiedAt: new Date(),
      status: 'OPEN',
      code,
    }, { transaction });

    await report.update({ status: 'CONVERTED_TO_RISK' }, { transaction });
    await maybeCreateCriticalAlert({
      site: report.site,
      risk,
      report,
      transaction,
    });

    return risk;
  });

  return getRisk(created.id);
}

async function resolveRisk(id) {
  const risk = await Risk.findByPk(id);
  if (!risk) throw new AppError(404, 'NOT_FOUND', 'Risque introuvable');
  if (risk.status === 'CLOSED') {
    throw new AppError(409, 'CONFLICT', 'Un risque clôturé ne peut plus être modifié');
  }
  await risk.update({ status: 'RESOLVED', resolvedAt: new Date() });
  return getRisk(id);
}

async function closeRisk(id) {
  const risk = await Risk.findByPk(id);
  if (!risk) throw new AppError(404, 'NOT_FOUND', 'Risque introuvable');
  if (risk.status !== 'RESOLVED') {
    throw new AppError(409, 'CONFLICT', 'Le risque doit être RESOLVED avant d’être CLOSED');
  }
  await risk.update({ status: 'CLOSED', closedAt: new Date() });
  return getRisk(id);
}

module.exports = {
  listRisks,
  getRisk,
  createRisk,
  updateRisk,
  convertReportToRisk,
  resolveRisk,
  closeRisk,
  maybeCreateCriticalAlert,
};
