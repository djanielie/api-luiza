const express = require('express');
const ctrl = require('../controllers/alertController');
const validate = require('../middlewares/validate');
const { alertCreate } = require('../validators/schemas');

const router = express.Router();

/**
 * @openapi
 * /alerts:
 *   get:
 *     summary: Liste des alertes
 *     tags: [Alerts]
 *   post:
 *     summary: Créer une alerte
 *     tags: [Alerts]
 */
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', validate(alertCreate), ctrl.create);
router.post('/:id/acknowledge', ctrl.acknowledge);
router.post('/:id/close', ctrl.close);

module.exports = router;
