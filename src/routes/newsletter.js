import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Subscriber } from '../models/Subscriber.js';

const router = Router();

router.post('/', body('email').isEmail(), async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email } = req.body;
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.json({ ok: true });
    const created = await Subscriber.create({ email });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try { res.json(await Subscriber.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});

export default router;