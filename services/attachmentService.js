const { Attachment, Report, Risk, Inspection } = require('../modele');
const AppError = require('../utils/AppError');

async function createAttachment(payload) {
  const linked = [payload.reportId, payload.riskId, payload.inspectionId].filter(Boolean);
  if (linked.length !== 1) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Le fichier doit être lié à exactement un objet : report, risk ou inspection');
  }
  if (payload.reportId && !(await Report.findByPk(payload.reportId))) {
    throw new AppError(404, 'NOT_FOUND', 'Signalement introuvable');
  }
  if (payload.riskId && !(await Risk.findByPk(payload.riskId))) {
    throw new AppError(404, 'NOT_FOUND', 'Risque introuvable');
  }
  if (payload.inspectionId && !(await Inspection.findByPk(payload.inspectionId))) {
    throw new AppError(404, 'NOT_FOUND', 'Inspection introuvable');
  }
  return Attachment.create(payload);
}

async function listAttachments(query) {
  const where = {};
  if (query.reportId) where.reportId = query.reportId;
  if (query.riskId) where.riskId = query.riskId;
  if (query.inspectionId) where.inspectionId = query.inspectionId;
  return Attachment.findAll({ where, order: [['createdAt', 'DESC']] });
}

module.exports = { createAttachment, listAttachments };
