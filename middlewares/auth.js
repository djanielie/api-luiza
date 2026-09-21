const jwt = require('jsonwebtoken');
const { User, RevokedToken } = require('../modele');
const { fail } = require('../vue/response');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return fail(res, 401, 'UNAUTHORIZED', 'Jeton manquant');
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      return fail(res, 500, 'SERVER_CONFIG', 'JWT_SECRET manquant');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.jti) {
      return fail(res, 401, 'UNAUTHORIZED', 'Jeton invalide');
    }

    const revoked = await RevokedToken.findOne({ where: { jti: decoded.jti } });
    if (revoked) {
      return fail(res, 401, 'UNAUTHORIZED', 'Session révoquée');
    }

    const user = await User.scope('withPassword').findByPk(decoded.id);
    if (!user) {
      return fail(res, 401, 'UNAUTHORIZED', 'Utilisateur introuvable');
    }
    if (!user.isActive) {
      return fail(res, 403, 'FORBIDDEN', 'Compte inactif');
    }

    req.user = user;
    req.tokenJti = decoded.jti;
    req.tokenExp = decoded.exp;
    return next();
  } catch (_) {
    return fail(res, 401, 'UNAUTHORIZED', 'Jeton invalide');
  }
}

function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return fail(res, 401, 'UNAUTHORIZED', 'Authentification requise');
    }
    if (!allowedRoles.includes(req.user.role)) {
      return fail(res, 403, 'FORBIDDEN', 'Accès refusé');
    }
    return next();
  };
}

module.exports = { authenticateToken, requireRoles };
