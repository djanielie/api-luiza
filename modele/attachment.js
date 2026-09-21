const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Attachment = sequelize.define('Attachment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  reportId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  riskId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  inspectionId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'attachments',
  timestamps: true,
  updatedAt: false,
});

Attachment.associate = function (models) {
  Attachment.belongsTo(models.Report, { foreignKey: 'reportId', as: 'report' });
  Attachment.belongsTo(models.Risk, { foreignKey: 'riskId', as: 'risk' });
  Attachment.belongsTo(models.Inspection, { foreignKey: 'inspectionId', as: 'inspection' });
};

module.exports = Attachment;
