const asyncHandler = require('../utils/asyncHandler');
const { success, created } = require('../vue/response');
const dashboardService = require('../services/dashboardService');
const attachmentService = require('../services/attachmentService');
const { User } = require('../modele');

exports.summary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary();
  return success(res, data);
});

exports.listUsers = asyncHandler(async (req, res) => {
  const data = await User.findAll({ order: [['name', 'ASC']] });
  return success(res, data);
});

exports.createUser = asyncHandler(async (req, res) => {
  const data = await User.create(req.body);
  return created(res, data, 'Utilisateur créé');
});

exports.listAttachments = asyncHandler(async (req, res) => {
  const data = await attachmentService.listAttachments(req.query);
  return success(res, data);
});

exports.createAttachment = asyncHandler(async (req, res) => {
  const data = await attachmentService.createAttachment(req.body);
  return created(res, data, 'Pièce jointe enregistrée');
});

exports.upload = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Aucun fichier reçu', details: [] },
    });
  }
  return created(res, {
    url: `/uploads/${req.file.filename}`,
    fileName: req.file.filename,
    mimeType: req.file.mimetype,
    fileSize: req.file.size,
  }, 'Fichier téléversé');
});
