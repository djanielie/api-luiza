const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const api = require('./api');
const swaggerSpec = require('./config/swagger');
const optionalApiKey = require('./middlewares/optionalApiKey');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const { uploadDir } = require('./middlewares/upload');

function createApp() {
  const app = express();

  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json());
  app.use('/uploads', express.static(path.resolve(uploadDir()), {
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Disposition', 'inline');
    },
  }));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/health', (req, res) => {
    res.json({ success: true, data: { status: 'ok', service: 'luiza-mining-safe-api' }, message: 'OK' });
  });
  app.use('/api/v1', optionalApiKey, api);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = createApp;
