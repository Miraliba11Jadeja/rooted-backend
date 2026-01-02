import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { requireAuth } from '../middleware/auth.js';

const router = Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

router.post('/', requireAuth, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res, next) => {
  try {
    const filename = req.file?.filename;
    if (!filename) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${filename}`;
    res.status(201).json({ url });
  } catch (e) { next(e); }
});

export default router;
