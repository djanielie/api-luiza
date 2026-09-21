const { Alert, Site, Report, Risk } = require('../modele');
const AppError = require('../utils/AppError');
const { nextCode } = require('./sequenceService');
const { formatWhatsAppAlert } = require('../vue/alertMessage');
const { sequelize } = require('../modele');

async function withWhatsApp(alert) {
  const json = alert.toJSON();
  json.whatsappMessage = formatWhatsAppAlert({
    site: json.site,
    alert: json,
    risk: json.risk,
    report: json.report,
  });
  return json;
}

async function listAlerts(query) {
  const where = {};
  if (query.siteId) where.siteId = query.siteId;
  if (query.priority) where.priority = query.priority;
  if (query.status) where.status = query.status;

  const rows = await Alert.findAll({
    where,
    include: [
      { model: Site, as: 'site' },
      { model: Report, as: 'report' },
      { model: Risk, as: 'risk' },
    ],
    order: [['createdAt', 'DESC']],
  });
  return Promise.all(rows.map(withWhatsApp));
}

async function getAlert(id) {
  const alert = await Alert.findByPk(id, {
    include: [
      { model: Site, as: 'site' },
      { model: Report, as: 'report' },
      { model: Risk, as: 'risk' },
    ],
  });
  if (!alert) throw new AppError(404, 'NOT_FOUND', 'Alerte introuvable');
  return withWhatsApp(alert);
}

async function createAlert(payload) {
  const created = await sequelize.transaction(async (transaction) => {
    const site = await Site.findByPk(payload.siteId, { transaction });
    if (!site) throw new AppError(404, 'NOT_FOUND', 'Site introuvable');
    const code = await nextCode('ALT', transaction);
    return Alert.create({
      ...payload,
      code,
      status: 'CREATED',
    }, { transaction });
  });
  return getAlert(created.id);
}

async function acknowledgeAlert(id) {
  const alert = await Alert.findByPk(id);
  if (!alert) throw new AppError(404, 'NOT_FOUND', 'Alerte introuvable');
  await alert.update({ status: 'ACKNOWLEDGED', acknowledgedAt: new Date() });
  return getAlert(id);
}

async function closeAlert(id) {
  const alert = await Alert.findByPk(id);
  if (!alert) throw new AppError(404, 'NOT_FOUND', 'Alerte introuvable');
  await alert.update({ status: 'CLOSED' });
  return getAlert(id);
}

module.exports = {
  listAlerts,
  getAlert,
  createAlert,
  acknowledgeAlert,
  closeAlert,
};
