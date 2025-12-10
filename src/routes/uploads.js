import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const uploadDir = path.resolve(process.cwd(), 'uploads');
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

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 } });

router.post('/', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    const filename = req.file?.filename;
    if (!filename) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${filename}`;
    res.status(201).json({ url });
  } catch (e) { next(e); }
});

export default router;
