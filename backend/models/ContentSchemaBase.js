import mongoose from 'mongoose';

// Shared building blocks reused across content models so the admin panel
// can treat every section the same way (title/description/images + a
// flexible "extra" bag so admin can add brand-new fields per item without
// a schema migration).
export const baseFields = {
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, default: '' },
  coverImage: { type: String, default: '' }, // cloudinary webp url
  coverImagePublicId: { type: String, default: '' },
  images: [
    {
      url: { type: String },
      publicId: { type: String },
      caption: { type: String, default: '' },
    },
  ],
  order: { type: Number, default: 0 },
  // Lets admin mark an item as "Popular" from the panel — shows it first
  // on the public listing pages and gives it the "Popular" badge.
  featured: { type: Boolean, default: false },
  // Free-form extra key/values -> lets admin add a "new element/field" to a
  // single item from the panel without touching backend code.
  extra: { type: mongoose.Schema.Types.Mixed, default: {} },
};

export default mongoose.Schema;
