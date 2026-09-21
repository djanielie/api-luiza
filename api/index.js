const express = require('express');
const sites = require('./sites');
const reports = require('./reports');
const inspections = require('./inspections');
const risks = require('./risks');
const actions = require('./actions');
const alerts = require('./alerts');
const auth = require('./auth');
const { dashboard, uploads, attachments, users } = require('./misc');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

router.use('/auth', auth);
router.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'luiza-mining-safe-api' }, message: 'OK' });
});

router.use(authenticateToken);
router.use('/sites', sites);
router.use('/reports', reports);
router.use('/inspections', inspections);
router.use('/risks', risks);
router.use('/actions', actions);
router.use('/alerts', alerts);
router.use('/dashboard', dashboard);
router.use('/uploads', uploads);
router.use('/attachments', attachments);
router.use('/users', users);

module.exports = router;
