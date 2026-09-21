const swaggerJsdoc = require('swagger-jsdoc');

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'LUIZA MINING SAFE API',
      version: '0.1.0',
      description: 'API REST MVP pour le suivi de sécurité des sites miniers artisanaux de Luiza.',
    },
    servers: [{ url: '/api/v1' }],
  },
  apis: ['./api/*.js'],
});

module.exports = spec;
