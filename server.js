const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { sequelize } = require('./modele');
const createApp = require('./app');
const { ensureUploadDir } = require('./middlewares/upload');
const { ensureDatabase } = require('./config/ensureDatabase');

const PORT = process.env.PORT || 3000;
const app = createApp();

async function start() {
  try {
    ensureUploadDir();
    await ensureDatabase();
    await sequelize.authenticate();
    await sequelize.sync();
    const server = app.listen(PORT, () => {
      console.log(`LUIZA MINING SAFE API sur le port ${PORT}`);
      console.log(`Swagger: http://localhost:${PORT}/api/docs`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Le port ${PORT} est déjà occupé.`);
      } else {
        console.error('Impossible de démarrer le serveur:', err.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Échec du démarrage:', error.parent?.sqlMessage || error.message);
    process.exit(1);
  }
}

start();
