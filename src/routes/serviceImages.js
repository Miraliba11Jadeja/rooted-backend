import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { ServiceImage } from '../models/ServiceImage.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { serviceId } = req.query;
    const query = serviceId ? { serviceId } : {};
    const docs = await ServiceImage.find(query).sort({ createdAt: -1 });
    res.json(docs);
  } catch (e) { next(e); }
});

router.post('/',
  requireAuth,
  body('serviceId').isString(),
  body('imageUrl').isString(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const created = await ServiceImage.create({ serviceId: req.body.serviceId, imageUrl: req.body.imageUrl });
      res.status(201).json(created);
    } catch (e) { next(e); }
  }
);

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await ServiceImage.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;

