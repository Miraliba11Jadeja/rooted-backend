import { Router } from 'express';
import { SEOSetting } from '../models/SEOSetting.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/:pageKey', async (req, res, next) => {
  try { res.json(await SEOSetting.findOne({ pageKey: req.params.pageKey }) || {}); } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try { res.json(await SEOSetting.find().sort({ pageKey: 1 })); } catch (e) { next(e); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try { res.status(201).json(await SEOSetting.create(req.body)); } catch (e) { next(e); }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try { res.json(await SEOSetting.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try { await SEOSetting.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
});

export default router;