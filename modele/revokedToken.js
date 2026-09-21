const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const RevokedToken = sequelize.define('RevokedToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  jti: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'revoked_tokens',
  timestamps: true,
  updatedAt: false,
  indexes: [
    { unique: true, fields: ['jti'] },
    { fields: ['expiresAt'] },
  ],
});

RevokedToken.associate = (models) => {
  RevokedToken.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = RevokedToken;
