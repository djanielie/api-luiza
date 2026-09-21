const express = require('express');
const ctrl = require('../controllers/inspectionController');
const validate = require('../middlewares/validate');
const { inspectionCreate, inspectionUpdate, inspectionRisk } = require('../validators/schemas');

const router = express.Router();

/**
 * @openapi
 * /inspections:
 *   get:
 *     summary: Liste des inspections
 *     tags: [Inspections]
 *   post:
 *     summary: Créer une inspection
 *     tags: [Inspections]
 */
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', validate(inspectionCreate), ctrl.create);
router.patch('/:id', validate(inspectionUpdate), ctrl.update);
router.post('/:id/complete', ctrl.complete);
router.post('/:id/risks', validate(inspectionRisk), ctrl.addRisk);

module.exports = router;
