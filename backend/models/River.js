import mongoose from 'mongoose';
import { baseFields } from './ContentSchemaBase.js';

const riverSchema = new mongoose.Schema(
  {
    ...baseFields,
    // See District.js for why this overrides baseFields' default of 0 —
    // keeps the curated river list fixed and appends new admin-added rivers
    // at the end (see CURATED_ORDER sort in server.js).
    order: { type: Number, default: 9999 },
    localName: { type: String, default: '' },
    lengthKm: { type: Number, default: 0 },
    origin: { type: String, default: '' },
    districts: [{ type: String }],
    wiki: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('River', riverSchema);
