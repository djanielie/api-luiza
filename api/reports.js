const express = require('express');
const ctrl = require('../controllers/reportController');
const validate = require('../middlewares/validate');
const { reportCreate, reportStatus, convertToRisk } = require('../validators/schemas');

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
router.post('/', validate(reportCreate), ctrl.create);
router.patch('/:id/status', validate(reportStatus), ctrl.updateStatus);
router.post('/:id/convert-to-risk', validate(convertToRisk), ctrl.convertToRisk);

module.exports = router;
