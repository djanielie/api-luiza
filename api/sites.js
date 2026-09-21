const express = require('express');
const ctrl = require('../controllers/siteController');
const validate = require('../middlewares/validate');
const { siteCreate, siteUpdate } = require('../validators/schemas');

const { ROLES, SITE_WRITERS } = require('../constants/roles');
const { requireRoles } = require('../middlewares/auth');

const router = express.Router();

/**
 * @openapi
 * /sites:
 *   get:
 *     summary: Liste des sites
 *     tags: [Sites]
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     summary: Créer un site
 *     tags: [Sites]
 */
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', requireRoles(...SITE_WRITERS), validate(siteCreate), ctrl.create);
router.put('/:id', requireRoles(...SITE_WRITERS), validate(siteUpdate), ctrl.update);
router.delete('/:id', requireRoles(ROLES.ADMIN), ctrl.remove);

module.exports = router;
