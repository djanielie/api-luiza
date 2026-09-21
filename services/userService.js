const { User } = require('../modele');
const AppError = require('../utils/AppError');

function publicUser(user) {
  return user.toPublic ? user.toPublic() : user;
}

async function listUsers() {
  const rows = await User.findAll({ order: [['name', 'ASC']] });
  return rows.map(publicUser);
}

async function getUser(id) {
  const user = await User.findByPk(id);
  if (!user) throw new AppError(404, 'NOT_FOUND', 'Utilisateur introuvable');
  return publicUser(user);
}

async function createUser(payload) {
  const existing = await User.findOne({ where: { username: payload.username } });
  if (existing) throw new AppError(409, 'CONFLICT', 'Cet identifiant existe déjà');
  const user = await User.create(payload);
  return publicUser(user);
}

async function updateUser(id, payload) {
  const user = await User.scope('withPassword').findByPk(id);
  if (!user) throw new AppError(404, 'NOT_FOUND', 'Utilisateur introuvable');
  if (payload.username && payload.username !== user.username) {
    const existing = await User.findOne({ where: { username: payload.username } });
    if (existing) throw new AppError(409, 'CONFLICT', 'Cet identifiant existe déjà');
  }
  await user.update(payload);
  return publicUser(user);
}

module.exports = { listUsers, getUser, createUser, updateUser };
