import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  main: { type: String },
  name: { type: String },
  description: { type: String },
  happyClients: { type: Number, default: 0 },
  yearsOfExperience: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
  livesTransformed: { type: Number, default: 0 }
}, { timestamps: true });

export const AboutSection = mongoose.model('AboutSection', schema);

