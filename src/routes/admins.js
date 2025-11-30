import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function requireAdminRole(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}

router.get('/', requireAuth, requireAdminRole, async (_req, res, next) => {
  try { res.json(await Admin.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.post(
  '/',
  requireAuth,
  requireAdminRole,
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  body('role').optional().isString(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { email, password, role = 'admin' } = req.body;
      const existing = await Admin.findOne({ email });
      if (existing) return res.status(409).json({ error: 'Email already exists' });
      const hash = await bcrypt.hash(password, 10);
      const created = await Admin.create({ email, passwordHash: hash, role });
      res.status(201).json(created);
    } catch (e) { next(e); }
  }
);

router.put(
  '/:id',
  requireAuth,
  requireAdminRole,
  body('email').optional().isEmail(),
  body('password').optional().isString().isLength({ min: 6 }),
  body('role').optional().isString(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const update = { ...req.body };
      if (update.password) {
        update.passwordHash = await bcrypt.hash(update.password, 10);
        delete update.password;
      }
      const updated = await Admin.findByIdAndUpdate(req.params.id, update, { new: true });
      res.json(updated);
    } catch (e) { next(e); }
  }
);

router.delete('/:id', requireAuth, requireAdminRole, async (req, res, next) => {
  try {
    if (req.user?.sub === req.params.id) return res.status(400).json({ error: 'Cannot delete your own account' });
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;

