const express = require('express');
const ctrl = require('../controllers/actionController');
const validate = require('../middlewares/validate');
const { actionUpdate } = require('../validators/schemas');

const { requireRoles } = require('../middlewares/auth');
const { STAFF, RISK_MANAGERS, VERIFIERS } = require('../constants/roles');

const router = express.Router();

/**
 * @openapi
 * /actions/{id}/start:
 *   post:
 *     summary: Passer une action à IN_PROGRESS
 *     tags: [CorrectiveActions]
 */
router.patch('/:id', requireRoles(...RISK_MANAGERS), validate(actionUpdate), ctrl.update);
router.post('/:id/start', requireRoles(...RISK_MANAGERS), ctrl.start);
router.post('/:id/complete', requireRoles(...RISK_MANAGERS), ctrl.complete);
router.post('/:id/verify', requireRoles(...VERIFIERS), ctrl.verify);

module.exports = router;
