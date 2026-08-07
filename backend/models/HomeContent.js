import mongoose from 'mongoose';

// Singleton document (one row) that drives the Home page's editable bits:
// hero video, hero images, and a few featured/highlight blocks.
const homeContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'home', unique: true },
    heroVideo: { type: String, default: '' },
    heroVideoPublicId: { type: String, default: '' },
    heroImages: [
      {
        url: String,
        publicId: String,
        caption: String,
      },
    ],
    headline: { type: String, default: '' },
    subheadline: { type: String, default: '' },
    extra: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model('HomeContent', homeContentSchema);
