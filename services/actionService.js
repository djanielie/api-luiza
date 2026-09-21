const { CorrectiveAction, Risk } = require('../modele');
const AppError = require('../utils/AppError');

async function listActions(riskId) {
  const risk = await Risk.findByPk(riskId);
  if (!risk) throw new AppError(404, 'NOT_FOUND', 'Risque introuvable');
  return CorrectiveAction.findAll({
    where: { riskId },
    order: [['createdAt', 'DESC']],
  });
}

async function createAction(riskId, payload) {
  const risk = await Risk.findByPk(riskId);
  if (!risk) throw new AppError(404, 'NOT_FOUND', 'Risque introuvable');
  return CorrectiveAction.create({ ...payload, riskId, status: 'PENDING' });
}

async function getAction(id) {
  const action = await CorrectiveAction.findByPk(id, { include: ['risk'] });
  if (!action) throw new AppError(404, 'NOT_FOUND', 'Action corrective introuvable');
  return action;
}

async function updateAction(id, payload) {
  const action = await getAction(id);
  await action.update(payload);
  return action;
}

async function markRiskInProgress(riskId) {
  const risk = await Risk.findByPk(riskId);
  if (risk && risk.status === 'OPEN') {
    await risk.update({ status: 'IN_PROGRESS' });
  }
}

async function startAction(id) {
  const action = await getAction(id);
  if (action.status !== 'PENDING') {
    throw new AppError(409, 'CONFLICT', 'Seule une action PENDING peut passer à IN_PROGRESS');
  }
  await action.update({ status: 'IN_PROGRESS' });
  await markRiskInProgress(action.riskId);
  return action;
}

async function completeAction(id) {
  const action = await getAction(id);
  if (action.status !== 'IN_PROGRESS') {
    throw new AppError(409, 'CONFLICT', 'Seule une action IN_PROGRESS peut passer à COMPLETED');
  }
  await action.update({ status: 'COMPLETED', completedAt: new Date() });
  return action;
}

async function verifyAction(id, verificationNotes) {
  const action = await getAction(id);
  if (action.status !== 'COMPLETED') {
    throw new AppError(409, 'CONFLICT', 'Seule une action COMPLETED peut passer à VERIFIED');
  }
  await action.update({
    status: 'VERIFIED',
    verifiedAt: new Date(),
    verificationNotes: verificationNotes || action.verificationNotes,
  });
  return action;
}

module.exports = {
  listActions,
  createAction,
  updateAction,
  startAction,
  completeAction,
  verifyAction,
};
