import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  text: { type: String },
  photo: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 5 }
}, { timestamps: true });

schema.pre('save', function(next) {
  if (!this.description && this.text) this.description = this.text;
  if (!this.text && this.description) this.text = this.description;
  next();
});

export const Testimonial = mongoose.model('Testimonial', schema);