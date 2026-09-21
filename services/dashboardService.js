const { Op } = require('sequelize');
const { Site, Risk, Report, CorrectiveAction } = require('../modele');

async function getSummary() {
  const now = new Date();
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
    Risk.count({ where: { status: { [Op.in]: ['OPEN', 'IN_PROGRESS'] } } }),
    Risk.count({ where: { priority: 'CRITICAL', status: { [Op.ne]: 'CLOSED' } } }),
    Report.count({ where: { status: { [Op.in]: ['RECEIVED', 'REVIEWED'] } } }),
    CorrectiveAction.count({ where: { status: { [Op.in]: ['PENDING', 'IN_PROGRESS'] } } }),
    CorrectiveAction.count({
      where: {
        status: { [Op.in]: ['PENDING', 'IN_PROGRESS'] },
        dueDate: { [Op.lt]: now },
      },
    }),
    Risk.count({ where: { status: 'CLOSED' } }),
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
