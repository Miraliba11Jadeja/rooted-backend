import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { ContactMessage } from '../models/ContactMessage.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post(
  '/',
  body('name').isString().trim().notEmpty(),
  body('email').isEmail(),
  body('subject').isString().trim().notEmpty(),
  body('message').isString().trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const created = await ContactMessage.create(req.body);
      res.status(201).json(created);
    } catch (e) { next(e); }
  }
);

router.get('/', requireAuth, async (_req, res, next) => {
  try { res.json(await ContactMessage.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try { await ContactMessage.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
});

export default router;

