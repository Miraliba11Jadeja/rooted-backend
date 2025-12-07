import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Service } from '../models/Service.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try { res.json(await Service.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.post('/', requireAuth,
  body('title').isString(),
  body('description').isString(),
  body('readMore').optional().isString(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const created = await Service.create(req.body);
      res.status(201).json(created);
    } catch (e) { next(e); }
  }
);

router.put('/:id', requireAuth, async (req, res, next) => {
  try { res.json(await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try { await Service.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
});

export default router;
