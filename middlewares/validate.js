const AppError = require('../utils/AppError');

function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return next(new AppError(400, 'VALIDATION_ERROR', 'Invalid data', details));
    }
    req.body = parsed.data;
    return next();
  };
}

module.exports = validate;
