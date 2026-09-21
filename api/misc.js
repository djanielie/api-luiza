const express = require('express');
const ctrl = require('../controllers/miscController');
const validate = require('../middlewares/validate');
const { upload } = require('../middlewares/upload');
const { attachmentCreate, userCreate, userUpdate } = require('../validators/schemas');
const { requireRoles } = require('../middlewares/auth');
const { USER_MANAGERS, REPORTERS, STAFF } = require('../constants/roles');

const dashboard = express.Router();
dashboard.get('/summary', ctrl.summary);

const uploads = express.Router();
uploads.post('/', requireRoles(...REPORTERS), upload.single('file'), ctrl.upload);

const attachments = express.Router();
attachments.get('/', requireRoles(...STAFF), ctrl.listAttachments);
attachments.post('/', requireRoles(...REPORTERS), validate(attachmentCreate), ctrl.createAttachment);

const users = express.Router();
users.get('/', requireRoles(...USER_MANAGERS), ctrl.listUsers);
users.get('/:id', requireRoles(...USER_MANAGERS), ctrl.getUser);
users.post('/', requireRoles(...USER_MANAGERS), validate(userCreate), ctrl.createUser);
users.patch('/:id', requireRoles(...USER_MANAGERS), validate(userUpdate), ctrl.updateUser);

module.exports = { dashboard, uploads, attachments, users };
