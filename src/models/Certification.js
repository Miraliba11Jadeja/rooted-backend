import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  issueDate: { type: Date }
}, { timestamps: true });

export const Certification = mongoose.model('Certification', schema);
