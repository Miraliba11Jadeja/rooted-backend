import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  pageKey: { type: String, unique: true, required: true },
  title: { type: String },
  description: { type: String },
  keywords: [{ type: String }],
  ogImage: { type: String }
}, { timestamps: true });

export const SEOSetting = mongoose.model('SEOSetting', schema);