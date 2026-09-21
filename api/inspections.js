const express = require('express');
const ctrl = require('../controllers/inspectionController');
const validate = require('../middlewares/validate');
const { inspectionCreate, inspectionUpdate, inspectionRisk } = require('../validators/schemas');

const { requireRoles } = require('../middlewares/auth');
const { INSPECTORS, STAFF } = require('../constants/roles');

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
router.get('/', requireRoles(...STAFF), ctrl.list);
router.get('/:id', requireRoles(...STAFF), ctrl.get);
router.post('/', requireRoles(...INSPECTORS), validate(inspectionCreate), ctrl.create);
router.patch('/:id', requireRoles(...INSPECTORS), validate(inspectionUpdate), ctrl.update);
router.post('/:id/complete', requireRoles(...INSPECTORS), ctrl.complete);
router.post('/:id/risks', requireRoles(...INSPECTORS), validate(inspectionRisk), ctrl.addRisk);

module.exports = router;
