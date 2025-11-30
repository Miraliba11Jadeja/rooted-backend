import { Router } from 'express';
import Stripe from 'stripe';
import { Payment } from '../models/Payment.js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res, next) => {
  try {
    const { planName, amount, currency = 'usd', customerEmail } = req.body;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [{
        price_data: {
          currency,
          product_data: { name: planName },
          unit_amount: Math.round(amount * 100)
        },
        quantity: 1
      }],
      success_url: process.env.PAYMENT_SUCCESS_URL,
      cancel_url: process.env.PAYMENT_CANCEL_URL
    });
    await Payment.create({ status: 'created', amount, currency, provider: 'stripe', checkoutSessionId: session.id, customerEmail, planName });
    res.json({ id: session.id, url: session.url });
  } catch (e) { next(e); }
});

// Webhook is mounted at app level in server.js

router.get('/', async (req, res, next) => {
  try { res.json(await Payment.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});

export default router;