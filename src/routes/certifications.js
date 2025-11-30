import { Router } from 'express';
import { Certification } from '../models/Certification.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try { res.json(await Certification.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, description, issueDate, title, issuer } = req.body;
    const payload = {
      name: name || title,
      description: description || issuer,
      issueDate,
      // legacy fields included for backward compatibility
      title: name || title,
      issuer: description || issuer
    };
    res.status(201).json(await Certification.create(payload));
  } catch (e) { next(e); }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { name, description, issueDate, title, issuer } = req.body;
    const payload = {
      name: name || title,
      description: description || issuer,
      issueDate,
      title: name || title,
      issuer: description || issuer
    };
    res.json(await Certification.findByIdAndUpdate(req.params.id, payload, { new: true }));
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try { await Certification.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
});

export default router;
