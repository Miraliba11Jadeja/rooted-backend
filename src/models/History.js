import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

export const History = mongoose.model('History', schema);

