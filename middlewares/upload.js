const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../utils/AppError');

const ALLOWED = new Set(['image/jpeg', 'image/jpg', 'image/png']);
const EXT = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
};

function uploadDir() {
  return path.resolve(process.env.UPLOAD_DIR || './uploads');
}

function ensureUploadDir() {
  const dir = uploadDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ensureUploadDir());
  },
  filename: (req, file, cb) => {
    const ext = EXT[file.mimetype] || path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: (parseInt(process.env.MAX_UPLOAD_SIZE_MB, 10) || 10) * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      return cb(new AppError(400, 'VALIDATION_ERROR', 'Seuls les fichiers JPG/JPEG/PNG sont acceptés'));
    }
    return cb(null, true);
  },
});

module.exports = { upload, uploadDir, ensureUploadDir };
