const express = require('express');
const ctrl = require('../controllers/actionController');
const validate = require('../middlewares/validate');
const { actionUpdate } = require('../validators/schemas');

const router = express.Router();

/**
 * @openapi
 * /actions/{id}/start:
 *   post:
 *     summary: Passer une action à IN_PROGRESS
 *     tags: [CorrectiveActions]
 */
router.patch('/:id', validate(actionUpdate), ctrl.update);
router.post('/:id/start', ctrl.start);
router.post('/:id/complete', ctrl.complete);
router.post('/:id/verify', ctrl.verify);

module.exports = router;
