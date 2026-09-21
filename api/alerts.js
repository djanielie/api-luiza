const express = require('express');
const ctrl = require('../controllers/alertController');
const validate = require('../middlewares/validate');
const { alertCreate } = require('../validators/schemas');

const { requireRoles } = require('../middlewares/auth');
const { STAFF, RISK_MANAGERS } = require('../constants/roles');

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
router.get('/', requireRoles(...STAFF), ctrl.list);
router.get('/:id', requireRoles(...STAFF), ctrl.get);
router.post('/', requireRoles(...RISK_MANAGERS), validate(alertCreate), ctrl.create);
router.post('/:id/acknowledge', requireRoles(...STAFF), ctrl.acknowledge);
router.post('/:id/close', requireRoles(...RISK_MANAGERS), ctrl.close);

module.exports = router;
