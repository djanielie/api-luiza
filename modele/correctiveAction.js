const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const { ACTION_STATUSES } = require('../constants/enums');

const CorrectiveAction = sequelize.define('CorrectiveAction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  riskId: {
    type: DataTypes.UUID,
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
  responsibleName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  responsiblePhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(...ACTION_STATUSES),
    allowNull: false,
    defaultValue: 'PENDING',
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  verificationNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'corrective_actions',
  timestamps: true,
});

CorrectiveAction.associate = function (models) {
  CorrectiveAction.belongsTo(models.Risk, { foreignKey: 'riskId', as: 'risk' });
};

module.exports = CorrectiveAction;
