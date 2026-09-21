const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const { RISK_TYPES, RISK_PRIORITIES, RISK_STATUSES } = require('../constants/enums');

const Risk = sequelize.define('Risk', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  siteId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  inspectionId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  reportId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  riskType: {
    type: DataTypes.ENUM(...RISK_TYPES),
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM(...RISK_PRIORITIES),
    allowNull: false,
  },
  exposedPersons: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  immediateMeasures: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(...RISK_STATUSES),
    allowNull: false,
    defaultValue: 'OPEN',
  },
  identifiedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'risks',
  timestamps: true,
});

Risk.associate = function (models) {
  Risk.belongsTo(models.Site, { foreignKey: 'siteId', as: 'site' });
  Risk.belongsTo(models.Inspection, { foreignKey: 'inspectionId', as: 'inspection' });
  Risk.belongsTo(models.Report, { foreignKey: 'reportId', as: 'report' });
  Risk.hasMany(models.CorrectiveAction, { foreignKey: 'riskId', as: 'actions' });
  Risk.hasMany(models.Attachment, { foreignKey: 'riskId', as: 'attachments' });
  Risk.hasMany(models.Alert, { foreignKey: 'riskId', as: 'alerts' });
};

module.exports = Risk;
