const express = require('express');
const ctrl = require('../controllers/riskController');
const validate = require('../middlewares/validate');
const { riskCreate, riskUpdate, actionCreate } = require('../validators/schemas');

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
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', validate(riskCreate), ctrl.create);
router.patch('/:id', validate(riskUpdate), ctrl.update);
router.post('/:id/resolve', ctrl.resolve);
router.post('/:id/close', ctrl.close);
router.get('/:riskId/actions', ctrl.listActions);
router.post('/:riskId/actions', validate(actionCreate), ctrl.createAction);

module.exports = router;
