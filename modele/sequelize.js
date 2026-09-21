const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Sequelize } = require('sequelize');

function createSequelize() {
  if (process.env.NODE_ENV === 'test') {
    return new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });
  }

  return new Sequelize(
    process.env.DB_NAME || 'luiza_mining_safe',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3307,
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        charset: 'utf8mb4',
      },
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    },
  );
}

const sequelize = createSequelize();

module.exports = sequelize;
