import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  review: { type: String, required: true }
}, { timestamps: true });

export const Review = mongoose.model('Review', schema);

