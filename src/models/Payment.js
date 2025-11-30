import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  status: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  provider: { type: String, default: 'stripe' },
  checkoutSessionId: { type: String },
  customerEmail: { type: String },
  planName: { type: String }
}, { timestamps: true });

export const Payment = mongoose.model('Payment', schema);