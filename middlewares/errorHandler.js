const { fail } = require('../vue/response');
const AppError = require('../utils/AppError');

function notFound(req, res) {
  return fail(res, 404, 'NOT_FOUND', `Route introuvable: ${req.method} ${req.originalUrl}`);
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return fail(res, err.statusCode, err.code, err.message, err.details);
  }

  if (err.name === 'ZodError') {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid data', err.issues || []);
  }

  const status = err.statusCode || 500;
  const expose = process.env.NODE_ENV !== 'production';
  return fail(
    res,
    status,
    'INTERNAL_ERROR',
    expose ? err.message : 'Internal Server Error',
    expose && err.stack ? [{ stack: err.stack }] : [],
  );
}

module.exports = { notFound, errorHandler };
