const mysql = require('mysql2/promise');

async function ensureDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT, 10) || 3307;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const name = process.env.DB_NAME || 'luiza_mining_safe';

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${name.replace(/`/g, '')}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await connection.end();
}

module.exports = { ensureDatabase };
