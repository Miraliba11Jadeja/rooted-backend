import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Plan } from '../models/Plan.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try { res.json(await Plan.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.post(
  '/',
  requireAuth,
  body('name').isString().trim().notEmpty(),
  body('price').isNumeric(),
  body('period').isString().trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const created = await Plan.create(req.body);
      res.status(201).json(created);
    } catch (e) { next(e); }
  }
);

router.put('/:id', requireAuth, async (req, res, next) => {
  try { res.json(await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try { await Plan.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
});

export default router;

