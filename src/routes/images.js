import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { SiteImages } from '../models/SiteImages.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const doc = await SiteImages.findOne().sort({ createdAt: -1 });
    res.json(doc || {});
  } catch (e) { next(e); }
});

router.post('/',
  requireAuth,
  body('mainImageUrl').optional().isString(),
  body('logoUrl').optional().isString(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const created = await SiteImages.create(req.body);
      res.status(201).json(created);
    } catch (e) { next(e); }
  }
);

router.put('/:id', requireAuth, async (req, res, next) => {
  try { res.json(await SiteImages.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); }
});

export default router;

