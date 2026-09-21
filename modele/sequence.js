const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Sequence = sequelize.define('Sequence', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  prefix: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lastNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'sequences',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['prefix', 'year'] },
  ],
});

module.exports = Sequence;
