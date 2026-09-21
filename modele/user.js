const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const { USER_ROLES } = require('../constants/enums');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM(...USER_ROLES),
    allowNull: false,
    defaultValue: 'REPORTER',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

User.associate = function (models) {
  User.hasMany(models.Inspection, { foreignKey: 'inspectorId', as: 'inspections' });
  User.hasMany(models.Report, { foreignKey: 'reporterId', as: 'reports' });
};

module.exports = User;
