import express from 'express';
import Stripe from 'stripe';
import { Payment } from './models/Payment.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default [express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await Payment.findOneAndUpdate({ checkoutSessionId: session.id }, { status: 'succeeded' });
  }
  res.json({ received: true });
}];