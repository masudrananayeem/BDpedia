import mongoose from 'mongoose';
import { baseFields } from './ContentSchemaBase.js';

const districtSchema = new mongoose.Schema(
  {
    ...baseFields,
    // Overrides baseFields' default order (0): the 64 seeded districts get an
    // explicit low `order` (their position in the curated list) via the seed
    // script, so any *new* district added later from admin defaults to this
    // high sentinel and is appended after all of them instead of jumping to
    // the front (see CURATED_ORDER sort in server.js).
    order: { type: Number, default: 9999 },
    division: { type: String, default: '' },
    history: { type: String, default: '' },
    touristPlacesSummary: { type: String, default: '' },
    wiki: { type: String, default: '' },
    howToReach: { type: String, default: '' },
    whereToStay: { type: String, default: '' },
    whatToEat: { type: String, default: '' },
    bestTimeToVisit: { type: String, default: '' },
    // Used by the budget Guide feature (feature #8). Admin-editable.
    budget: {
      dailyStayLow: { type: Number, default: 800 },   // BDT / day, budget hotel
      dailyStayMid: { type: Number, default: 2000 },  // BDT / day, mid hotel
      dailyFood: { type: Number, default: 500 },       // BDT / day
      dailyLocalTransport: { type: Number, default: 300 }, // BDT / day
    },
  },
  { timestamps: true }
);

export default mongoose.model('District', districtSchema);
