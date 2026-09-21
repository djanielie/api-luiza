const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const { INSPECTION_STATUSES } = require('../constants/enums');

const Inspection = sequelize.define('Inspection', {
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
  inspectorId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  inspectionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  generalCondition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ppeAvailable: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  ppeUsed: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  specialRiskZones: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  immediateMeasures: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  recommendedActions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(...INSPECTION_STATUSES),
    allowNull: false,
    defaultValue: 'OPEN',
  },
}, {
  tableName: 'inspections',
  timestamps: true,
});

Inspection.associate = function (models) {
  Inspection.belongsTo(models.Site, { foreignKey: 'siteId', as: 'site' });
  Inspection.belongsTo(models.User, { foreignKey: 'inspectorId', as: 'inspector' });
  Inspection.hasMany(models.Risk, { foreignKey: 'inspectionId', as: 'risks' });
  Inspection.hasMany(models.Attachment, { foreignKey: 'inspectionId', as: 'attachments' });
};

module.exports = Inspection;
