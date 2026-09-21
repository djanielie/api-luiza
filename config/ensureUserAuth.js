const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sequelize = require('../modele/sequelize');

async function tableExists() {
  const [rows] = await sequelize.query("SHOW TABLES LIKE 'users'");
  return rows.length > 0;
}

async function columnNames(table) {
  const [cols] = await sequelize.query(`SHOW COLUMNS FROM \`${table}\``);
  return cols.map((c) => c.Field);
}

async function dropUsernameUniqueIndexes() {
  const [indexes] = await sequelize.query("SHOW INDEX FROM `users` WHERE Column_name = 'username'");
  const seen = new Set();
  for (const idx of indexes) {
    if (!idx.Non_unique && idx.Key_name !== 'PRIMARY' && !seen.has(idx.Key_name)) {
      seen.add(idx.Key_name);
      await sequelize.query(`ALTER TABLE \`users\` DROP INDEX \`${idx.Key_name}\``);
    }
  }
}

function usernameFrom(name, id) {
  const base = String(name || 'user')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 16) || 'user';
  return `${base}-${String(id).replace(/-/g, '').slice(0, 8)}`;
}

async function ensureUserAuthColumns() {
  if (sequelize.getDialect() !== 'mysql') return;
  if (!(await tableExists())) return;

  const cols = await columnNames('users');
  if (!cols.includes('username')) {
    await sequelize.query('ALTER TABLE `users` ADD COLUMN `username` VARCHAR(255) NULL');
  }
  if (!cols.includes('password')) {
    await sequelize.query('ALTER TABLE `users` ADD COLUMN `password` VARCHAR(255) NULL');
  }
  if (!cols.includes('failedLoginCount')) {
    await sequelize.query('ALTER TABLE `users` ADD COLUMN `failedLoginCount` INT NOT NULL DEFAULT 0');
  }

  await dropUsernameUniqueIndexes();

  const [users] = await sequelize.query('SELECT `id`, `name`, `username`, `password` FROM `users`');
  const assigned = new Set();
  const dummyHash = await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 10);

  for (const user of users) {
    let next = (user.username || '').trim();
    if (!next || assigned.has(next)) {
      next = usernameFrom(user.name, user.id);
      let n = 1;
      while (assigned.has(next)) {
        next = `${usernameFrom(user.name, user.id)}${n}`;
        n += 1;
      }
    }
    assigned.add(next);
    const password = user.password && String(user.password).startsWith('$2') ? user.password : dummyHash;
    await sequelize.query(
      'UPDATE `users` SET `username` = :username, `password` = :password WHERE `id` = :id',
      { replacements: { username: next, password, id: user.id } },
    );
  }

  await sequelize.query('ALTER TABLE `users` MODIFY `username` VARCHAR(255) NOT NULL');
  await sequelize.query('ALTER TABLE `users` MODIFY `password` VARCHAR(255) NOT NULL');

  const [unique] = await sequelize.query("SHOW INDEX FROM `users` WHERE Column_name = 'username' AND Non_unique = 0");
  if (unique.length === 0) {
    await sequelize.query('CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`)');
  }
}

module.exports = { ensureUserAuthColumns };
