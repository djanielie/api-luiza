const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('./sequelize');
const { USER_ROLES } = require('../constants/enums');

function isBcryptHash(value) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);
}

async function hashPassword(plain) {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
  return bcrypt.hash(plain, saltRounds);
}

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
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
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
  failedLoginCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'users',
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: { attributes: {} },
  },
  hooks: {
    beforeCreate: async (user) => {
      if (user.password && !isBcryptHash(user.password)) {
        user.password = await hashPassword(user.password);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && user.password && !isBcryptHash(user.password)) {
        user.password = await hashPassword(user.password);
      }
    },
  },
});

User.prototype.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

User.prototype.toPublic = function () {
  const json = this.toJSON();
  delete json.password;
  return json;
};

User.associate = function (models) {
  User.hasMany(models.Inspection, { foreignKey: 'inspectorId', as: 'inspections' });
  User.hasMany(models.Report, { foreignKey: 'reporterId', as: 'reports' });
  User.hasMany(models.RevokedToken, { foreignKey: 'userId', as: 'revokedTokens' });
};

module.exports = User;
