const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const { SITE_STATUSES } = require('../constants/enums');

const Site = sequelize.define('Site', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true,
  },
  responsibleName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  responsiblePhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(...SITE_STATUSES),
    allowNull: false,
    defaultValue: 'ACTIVE',
  },
}, {
  tableName: 'sites',
  timestamps: true,
});

Site.associate = function (models) {
  Site.hasMany(models.Inspection, { foreignKey: 'siteId', as: 'inspections' });
  Site.hasMany(models.Report, { foreignKey: 'siteId', as: 'reports' });
  Site.hasMany(models.Risk, { foreignKey: 'siteId', as: 'risks' });
  Site.hasMany(models.Alert, { foreignKey: 'siteId', as: 'alerts' });
};

module.exports = Site;
