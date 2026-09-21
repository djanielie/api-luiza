function isLocalBrowserOrigin(origin) {
  if (!origin) return true;
  try {
    const host = new URL(origin).hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  } catch (_) {
    return false;
  }
}

function corsOptions() {
  const raw = process.env.CORS_ORIGINS;
  const origins = (raw || '*')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const allowAll = origins.length === 0 || origins.includes('*');

  return {
    origin(origin, callback) {
      if (!origin || allowAll || isLocalBrowserOrigin(origin) || origins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  };
}

module.exports = { corsOptions };
