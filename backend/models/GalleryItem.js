import mongoose from 'mongoose';
import { baseFields } from './ContentSchemaBase.js';

const galleryItemSchema = new mongoose.Schema(
  {
    ...baseFields,
    category: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('GalleryItem', galleryItemSchema);
