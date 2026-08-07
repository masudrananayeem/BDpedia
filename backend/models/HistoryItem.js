import mongoose from 'mongoose';
import { baseFields } from './ContentSchemaBase.js';

const historyItemSchema = new mongoose.Schema(
  {
    ...baseFields,
    era: { type: String, default: '' },
    period: { type: String, default: '' }, // e.g. "1600-1700"
  },
  { timestamps: true }
);

export default mongoose.model('HistoryItem', historyItemSchema);
