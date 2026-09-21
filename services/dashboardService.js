const { Op } = require('sequelize');
const { Site, Risk, Report, CorrectiveAction } = require('../modele');
const { ROLES } = require('../constants/roles');

async function getSummary(user) {
  const now = new Date();
  const reportWhere = user?.role === ROLES.REPORTER ? { reporterId: user.id } : {};
  const staff = user?.role !== ROLES.REPORTER;

  const [
    sites,
    openRisks,
    criticalRisks,
    openReports,
    activeActions,
    overdueActions,
    closedRisks,
  ] = await Promise.all([
    Site.count({ where: { status: 'ACTIVE' } }),
    staff ? Risk.count({ where: { status: { [Op.in]: ['OPEN', 'IN_PROGRESS'] } } }) : Promise.resolve(0),
    staff ? Risk.count({ where: { priority: 'CRITICAL', status: { [Op.ne]: 'CLOSED' } } }) : Promise.resolve(0),
    Report.count({ where: { ...reportWhere, status: { [Op.in]: ['RECEIVED', 'REVIEWED'] } } }),
    staff ? CorrectiveAction.count({ where: { status: { [Op.in]: ['PENDING', 'IN_PROGRESS'] } } }) : Promise.resolve(0),
    staff
      ? CorrectiveAction.count({
        where: {
          status: { [Op.in]: ['PENDING', 'IN_PROGRESS'] },
          dueDate: { [Op.lt]: now },
        },
      })
      : Promise.resolve(0),
    staff ? Risk.count({ where: { status: 'CLOSED' } }) : Promise.resolve(0),
  ]);

  return {
    sites,
    openRisks,
    criticalRisks,
    openReports,
    activeActions,
    overdueActions,
    closedRisks,
  };
}

module.exports = { getSummary };
