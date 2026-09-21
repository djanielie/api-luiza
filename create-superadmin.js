/**
 * Crée ou met à jour le super-admin (rôle ADMIN).
 * Ne vide pas la base.
 *
 *   npm run superadmin
 *
 * Variables .env : ADMIN_USERNAME, ADMIN_PASSWORD (obligatoires).
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { sequelize, User } = require('./modele');
const { ensureDatabase } = require('./config/ensureDatabase');
const { ensureUserAuthColumns } = require('./config/ensureUserAuth');

async function run() {
  const username = (process.env.ADMIN_USERNAME || '').trim();
  const password = process.env.ADMIN_PASSWORD || '';
  const name = (process.env.ADMIN_NAME || 'Administrateur').trim();
  const phone = (process.env.ADMIN_PHONE || '').trim() || null;

  if (!username || username.length < 3) {
    console.error('ADMIN_USERNAME manquant ou trop court (min. 3).');
    process.exit(1);
  }
  if (!password || password.length < 6) {
    console.error('ADMIN_PASSWORD manquant ou trop court (min. 6).');
    process.exit(1);
  }

  await ensureDatabase();
  await sequelize.authenticate();
  await ensureUserAuthColumns();
  await sequelize.sync();

  const existing = await User.scope('withPassword').findOne({ where: { username } });
  if (existing) {
    await existing.update({
      name,
      phone,
      password,
      role: 'ADMIN',
      isActive: true,
      failedLoginCount: 0,
    });
    console.log(`Super-admin mis à jour : ${username}`);
  } else {
    await User.create({
      name,
      username,
      password,
      phone,
      role: 'ADMIN',
      isActive: true,
    });
    console.log(`Super-admin créé : ${username}`);
  }

  await sequelize.close();
}

run().catch((err) => {
  console.error('Échec super-admin:', err.parent?.sqlMessage || err.message);
  process.exit(1);
});
