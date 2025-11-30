import { Router } from 'express';
import { Testimonial } from '../models/Testimonial.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try { res.json(await Testimonial.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try { res.status(201).json(await Testimonial.create(req.body)); } catch (e) { next(e); }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try { res.json(await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try { await Testimonial.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
});

export default router;