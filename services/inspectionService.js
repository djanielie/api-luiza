const { sequelize, Site, User, Inspection, Risk, Attachment } = require('../modele');
const AppError = require('../utils/AppError');
const { nextCode } = require('./sequenceService');
const { dateRange } = require('./siteService');
const { assertSite } = require('./reportService');
const { maybeCreateCriticalAlert } = require('./riskService');

async function listInspections(query) {
  const where = {};
  if (query.siteId) where.siteId = query.siteId;
  if (query.status) where.status = query.status;
  const range = dateRange(query.from, query.to);
  if (range) where.inspectionDate = range;

  return Inspection.findAll({
    where,
    include: [
      { model: Site, as: 'site' },
      { model: User, as: 'inspector' },
    ],
    order: [['inspectionDate', 'DESC']],
  });
}

async function getInspection(id) {
  const inspection = await Inspection.findByPk(id, {
    include: [
      { model: Site, as: 'site' },
      { model: User, as: 'inspector' },
      { model: Risk, as: 'risks' },
      { model: Attachment, as: 'attachments' },
    ],
  });
  if (!inspection) throw new AppError(404, 'NOT_FOUND', 'Inspection introuvable');
  return inspection;
}

async function createInspection(payload) {
  const inspection = await sequelize.transaction(async (transaction) => {
    const site = await assertSite(payload.siteId, transaction);
    if (payload.inspectorId) {
      const inspector = await User.findByPk(payload.inspectorId, { transaction });
      if (!inspector) throw new AppError(404, 'NOT_FOUND', 'Inspecteur introuvable');
    }
    const code = await nextCode('INSP', transaction);
    const { risks = [], ...fields } = payload;
    const inspection = await Inspection.create({
      ...fields,
      code,
      inspectionDate: fields.inspectionDate || new Date(),
      status: 'OPEN',
    }, { transaction });

    for (const risk of risks) {
      const riskCode = await nextCode('RISK', transaction);
      const createdRisk = await Risk.create({
        siteId: inspection.siteId,
        inspectionId: inspection.id,
        title: risk.title,
        description: risk.description,
        riskType: risk.riskType,
        priority: risk.priority,
        exposedPersons: risk.exposedPersons,
        immediateMeasures: risk.immediateMeasures,
        identifiedAt: new Date(),
        status: 'OPEN',
        code: riskCode,
      }, { transaction });
      await maybeCreateCriticalAlert({ site, risk: createdRisk, transaction });
    }

    return inspection;
  });

  return getInspection(inspection.id);
}

async function updateInspection(id, payload) {
  const inspection = await Inspection.findByPk(id);
  if (!inspection) throw new AppError(404, 'NOT_FOUND', 'Inspection introuvable');
  await inspection.update(payload);
  return getInspection(id);
}

async function completeInspection(id) {
  const inspection = await Inspection.findByPk(id);
  if (!inspection) throw new AppError(404, 'NOT_FOUND', 'Inspection introuvable');
  await inspection.update({ status: 'COMPLETED' });
  return getInspection(id);
}

async function addRiskToInspection(inspectionId, payload) {
  const created = await sequelize.transaction(async (transaction) => {
    const inspection = await Inspection.findByPk(inspectionId, {
      include: [{ model: Site, as: 'site' }],
      transaction,
    });
    if (!inspection) throw new AppError(404, 'NOT_FOUND', 'Inspection introuvable');

    const riskCode = await nextCode('RISK', transaction);
    const risk = await Risk.create({
      siteId: inspection.siteId,
      inspectionId: inspection.id,
      title: payload.title,
      description: payload.description,
      riskType: payload.riskType,
      priority: payload.priority,
      exposedPersons: payload.exposedPersons,
      immediateMeasures: payload.immediateMeasures,
      identifiedAt: new Date(),
      status: 'OPEN',
      code: riskCode,
    }, { transaction });

    await maybeCreateCriticalAlert({ site: inspection.site, risk, transaction });
    return risk;
  });

  return created;
}

module.exports = {
  listInspections,
  getInspection,
  createInspection,
  updateInspection,
  completeInspection,
  addRiskToInspection,
};
