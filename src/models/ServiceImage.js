import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

export const ServiceImage = mongoose.model('ServiceImage', schema);

