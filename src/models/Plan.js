import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  period: { type: String, default: 'per month' },
  features: [{ type: String }],
  popular: { type: Boolean, default: false }
}, { timestamps: true });

export const Plan = mongoose.model('Plan', schema);