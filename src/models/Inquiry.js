import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  serviceName: { type: String, required: true }
}, { timestamps: true });

export const Inquiry = mongoose.model('Inquiry', schema);

