function corsOptions() {
  const raw = process.env.CORS_ORIGINS;
  const origins = (raw || '*')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const allowAll = origins.length === 0 || origins.includes('*');

  return {
    origin: allowAll ? true : origins,
    credentials: true,
  };
}

module.exports = { corsOptions };
