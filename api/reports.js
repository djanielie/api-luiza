const express = require('express');
const ctrl = require('../controllers/reportController');
const validate = require('../middlewares/validate');
const { reportCreate, reportStatus, convertToRisk } = require('../validators/schemas');

const { requireRoles } = require('../middlewares/auth');
const { STAFF, RISK_MANAGERS, REPORTERS } = require('../constants/roles');

const router = express.Router();

/**
 * @openapi
 * /reports:
 *   get:
 *     summary: Liste des signalements
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: siteId
 *       - in: query
 *         name: type
 *       - in: query
 *         name: status
 *       - in: query
 *         name: from
 *       - in: query
 *         name: to
 *   post:
 *     summary: Créer un signalement
 *     tags: [Reports]
 */
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', requireRoles(...REPORTERS), validate(reportCreate), ctrl.create);
router.patch('/:id/status', requireRoles(...STAFF), validate(reportStatus), ctrl.updateStatus);
router.post('/:id/convert-to-risk', requireRoles(...RISK_MANAGERS), validate(convertToRisk), ctrl.convertToRisk);

module.exports = router;
