const express = require('express');
const ctrl = require('../controllers/riskController');
const validate = require('../middlewares/validate');
const { riskCreate, riskUpdate, actionCreate } = require('../validators/schemas');

const { requireRoles } = require('../middlewares/auth');
const { STAFF, RISK_MANAGERS } = require('../constants/roles');

const router = express.Router();

/**
 * @openapi
 * /risks:
 *   get:
 *     summary: Liste des risques
 *     tags: [Risks]
 *   post:
 *     summary: Créer un risque
 *     tags: [Risks]
 */
router.get('/', requireRoles(...STAFF), ctrl.list);
router.get('/:id', requireRoles(...STAFF), ctrl.get);
router.post('/', requireRoles(...RISK_MANAGERS), validate(riskCreate), ctrl.create);
router.patch('/:id', requireRoles(...RISK_MANAGERS), validate(riskUpdate), ctrl.update);
router.post('/:id/resolve', requireRoles(...RISK_MANAGERS), ctrl.resolve);
router.post('/:id/close', requireRoles(...RISK_MANAGERS), ctrl.close);
router.get('/:riskId/actions', requireRoles(...STAFF), ctrl.listActions);
router.post('/:riskId/actions', requireRoles(...RISK_MANAGERS), validate(actionCreate), ctrl.createAction);

module.exports = router;
