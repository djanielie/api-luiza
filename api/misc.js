const express = require('express');
const ctrl = require('../controllers/miscController');
const validate = require('../middlewares/validate');
const { upload } = require('../middlewares/upload');
const { attachmentCreate, userCreate } = require('../validators/schemas');

const dashboard = express.Router();
dashboard.get('/summary', ctrl.summary);

const uploads = express.Router();
uploads.post('/', upload.single('file'), ctrl.upload);

const attachments = express.Router();
attachments.get('/', ctrl.listAttachments);
attachments.post('/', validate(attachmentCreate), ctrl.createAttachment);

const users = express.Router();
users.get('/', ctrl.listUsers);
users.post('/', validate(userCreate), ctrl.createUser);

module.exports = { dashboard, uploads, attachments, users };
