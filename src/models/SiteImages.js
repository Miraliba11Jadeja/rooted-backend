import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  mainImageUrl: { type: String },
  logoUrl: { type: String }
}, { timestamps: true });

export const SiteImages = mongoose.model('SiteImages', schema);

