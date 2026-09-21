const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User, RevokedToken } = require('../modele');
const { success, fail } = require('../vue/response');
const asyncHandler = require('../utils/asyncHandler');
const { MAX_FAILED_LOGINS, JWT_EXPIRES_IN } = require('../constants/security');

function isBcryptHash(value) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);
}

exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Identifiant et mot de passe requis');
  }

  const user = await User.scope('withPassword').findOne({ where: { username } });
  if (!user) {
    return fail(res, 401, 'UNAUTHORIZED', 'Identifiants invalides');
  }

  if (!user.isActive) {
    return fail(res, 403, 'FORBIDDEN', 'Compte inactif');
  }

  const valid = isBcryptHash(user.password) ? await bcrypt.compare(password, user.password) : false;
  if (!valid) {
    const nextCount = (user.failedLoginCount || 0) + 1;
    const locked = nextCount >= MAX_FAILED_LOGINS;
    await user.update({
      failedLoginCount: nextCount,
      ...(locked ? { isActive: false } : {}),
    });
    if (locked) {
      return fail(res, 403, 'FORBIDDEN', 'Compte bloqué après trop de tentatives');
    }
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Identifiants invalides',
        details: [],
      },
      remainingAttempts: MAX_FAILED_LOGINS - nextCount,
      failedAttempts: nextCount,
    });
  }

  if (!process.env.JWT_SECRET) {
    return fail(res, 500, 'SERVER_CONFIG', 'JWT_SECRET manquant');
  }

  if (user.failedLoginCount) {
    await user.update({ failedLoginCount: 0 });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN, jwtid: crypto.randomUUID() },
  );

  return success(res, { token, user: user.toPublic() }, 'Connecté');
});

exports.logout = asyncHandler(async (req, res) => {
  if (req.tokenJti) {
    const expiresAt = req.tokenExp
      ? new Date(req.tokenExp * 1000)
      : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    await RevokedToken.findOrCreate({
      where: { jti: req.tokenJti },
      defaults: { jti: req.tokenJti, userId: req.user.id, expiresAt },
    });
    await RevokedToken.destroy({ where: { expiresAt: { [Op.lt]: new Date() } } });
  }
  return success(res, { ok: true }, 'Déconnexion enregistrée');
});

exports.me = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return fail(res, 404, 'NOT_FOUND', 'Utilisateur introuvable');
  return success(res, user.toPublic());
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Ancien et nouveau mot de passe requis');
  }
  if (newPassword.length < 6) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Le mot de passe doit contenir au moins 6 caractères');
  }

  const user = await User.scope('withPassword').findByPk(req.user.id);
  if (!user) return fail(res, 404, 'NOT_FOUND', 'Utilisateur introuvable');

  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) return fail(res, 401, 'UNAUTHORIZED', 'Mot de passe actuel incorrect');

  await user.update({ password: newPassword });
  return success(res, { ok: true }, 'Mot de passe mis à jour');
});
