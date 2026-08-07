import mongoose from 'mongoose';
import { baseFields } from './ContentSchemaBase.js';

const placeSchema = new mongoose.Schema(
  {
    ...baseFields,
    category: { type: String, default: '' },
    district: { type: String, default: '' }, // district name (matches District.title)
    entryFee: { type: String, default: '' },
    openingHours: { type: String, default: '' },
    wiki: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Place', placeSchema);
