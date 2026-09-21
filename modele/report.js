const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const { REPORT_TYPES, REPORT_STATUSES } = require('../constants/enums');

const Report = sequelize.define('Report', {
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
  reporterId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  reporterName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reporterPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reportDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(...REPORT_TYPES),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  peopleAffected: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  immediateMeasures: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  locationDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(...REPORT_STATUSES),
    allowNull: false,
    defaultValue: 'RECEIVED',
  },
}, {
  tableName: 'reports',
  timestamps: true,
});

Report.associate = function (models) {
  Report.belongsTo(models.Site, { foreignKey: 'siteId', as: 'site' });
  Report.belongsTo(models.User, { foreignKey: 'reporterId', as: 'reporter' });
  Report.hasMany(models.Attachment, { foreignKey: 'reportId', as: 'attachments' });
  Report.hasMany(models.Risk, { foreignKey: 'reportId', as: 'risks' });
  Report.hasMany(models.Alert, { foreignKey: 'reportId', as: 'alerts' });
};

module.exports = Report;
