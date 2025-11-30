import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  tip: { type: String },
  date: { type: Date, required: true },
  imageUrl: { type: String }
}, { timestamps: true });

export const Blog = mongoose.model('Blog', schema);
