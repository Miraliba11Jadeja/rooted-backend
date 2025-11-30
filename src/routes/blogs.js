import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Blog } from '../models/Blog.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try { res.json(await Blog.find().sort({ date: -1, createdAt: -1 })); } catch (e) { next(e); }
});

router.post('/',
  requireAuth,
  body('title').isString().trim().notEmpty(),
  body('description').optional().isString(),
  body('tip').optional().isString(),
  body('imageUrl').optional().isString(),
  body('date').optional().isISO8601(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const payload = { ...req.body };
      if (!payload.date) payload.date = new Date();
      const created = await Blog.create(payload);
      res.status(201).json(created);
    } catch (e) { next(e); }
  }
);

router.put('/:id', requireAuth, async (req, res, next) => {
  try { res.json(await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try { await Blog.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
});

export default router;
