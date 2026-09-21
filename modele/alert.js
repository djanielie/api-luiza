const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const {
  ALERT_TYPES,
  ALERT_PRIORITIES,
  ALERT_CHANNELS,
  ALERT_STATUSES,
} = require('../constants/enums');

const Alert = sequelize.define('Alert', {
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
  reportId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  riskId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM(...ALERT_TYPES),
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM(...ALERT_PRIORITIES),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  channel: {
    type: DataTypes.ENUM(...ALERT_CHANNELS),
    allowNull: false,
    defaultValue: 'MANUAL',
  },
  status: {
    type: DataTypes.ENUM(...ALERT_STATUSES),
    allowNull: false,
    defaultValue: 'CREATED',
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  acknowledgedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'alerts',
  timestamps: true,
});

Alert.associate = function (models) {
  Alert.belongsTo(models.Site, { foreignKey: 'siteId', as: 'site' });
  Alert.belongsTo(models.Report, { foreignKey: 'reportId', as: 'report' });
  Alert.belongsTo(models.Risk, { foreignKey: 'riskId', as: 'risk' });
};

module.exports = Alert;
