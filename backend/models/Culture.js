import mongoose from 'mongoose';
import { baseFields } from './ContentSchemaBase.js';

const cultureSchema = new mongoose.Schema(
  {
    ...baseFields,
    category: { type: String, default: '' }, // food / festival / dress / music / craft etc
  },
  { timestamps: true }
);

export default mongoose.model('Culture', cultureSchema);
