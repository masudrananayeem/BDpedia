import mongoose from 'mongoose';
import { baseFields } from './ContentSchemaBase.js';

const blogSchema = new mongoose.Schema(
  {
    ...baseFields,
    author: { type: String, default: 'BDpedia Team' },
    category: { type: String, default: 'Travel' },
    content: [{ type: String }], // paragraphs
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Blog', blogSchema);
