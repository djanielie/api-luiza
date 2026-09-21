function success(res, data, message = 'Operation successful', status = 200) {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
}

function created(res, data, message = 'Created') {
  return success(res, data, message, 201);
}

function fail(res, status, code, message, details = []) {
  return res.status(status).json({
    success: false,
    error: { code, message, details },
  });
}

module.exports = { success, created, fail };
