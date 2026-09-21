const { fail } = require('../vue/response');

function optionalApiKey(req, res, next) {
  const expected = process.env.API_KEY;
  if (!expected) return next();
  const provided = req.header('X-API-Key');
  if (provided !== expected) {
    return fail(res, 401, 'UNAUTHORIZED', 'Clé API invalide ou manquante');
  }
  return next();
}

module.exports = optionalApiKey;
