import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { AboutSection } from '../models/AboutSection.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const doc = await AboutSection.findOne();
    res.json(doc || {});
  } catch (e) { next(e); }
});

router.post('/',
  requireAuth,
  body('name').optional().isString(),
  body('main').optional().isString(),
  body('description').optional().isString(),
  body('happyClients').optional().isNumeric(),
  body('yearsOfExperience').optional().isNumeric(),
  body('successRate').optional().isNumeric(),
  body('livesTransformed').optional().isNumeric(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const created = await AboutSection.create(req.body);
      res.status(201).json(created);
    } catch (e) { next(e); }
  }
);

router.put('/:id', requireAuth, async (req, res, next) => {
  try { res.json(await AboutSection.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); }
});

export default router;

