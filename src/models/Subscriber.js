import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email: { type: String, unique: true, required: true }
}, { timestamps: true });

export const Subscriber = mongoose.model('Subscriber', schema);