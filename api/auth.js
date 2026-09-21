const express = require('express');
const ctrl = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

router.post('/login', ctrl.login);
router.post('/logout', authenticateToken, ctrl.logout);
router.get('/me', authenticateToken, ctrl.me);
router.post('/change-password', authenticateToken, ctrl.changePassword);

module.exports = router;
