import express from 'express';
import HomeContent from '../models/HomeContent.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

const router = express.Router();

async function getOrCreateHome() {
  let doc = await HomeContent.findOne({ key: 'home' });
  if (!doc) doc = await HomeContent.create({ key: 'home' });
  return doc;
}

// GET /api/home (public)
router.get('/', async (_req, res) => {
  try {
    const doc = await getOrCreateHome();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/home (admin) - text fields
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const doc = await getOrCreateHome();
    const { headline, subheadline, extra } = req.body;
    if (headline !== undefined) doc.headline = headline;
    if (subheadline !== undefined) doc.subheadline = subheadline;
    if (extra !== undefined) {
      doc.extra = typeof extra === 'string' ? JSON.parse(extra) : extra;
    }
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/home/video (admin, multipart: video)
router.put('/video', protect, adminOnly, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Video file not provided' });
    const doc = await getOrCreateHome();
    if (doc.heroVideoPublicId) await deleteFromCloudinary(doc.heroVideoPublicId, 'video');

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'bdpedia/home',
      resourceType: 'video',
    });
    doc.heroVideo = result.secure_url;
    doc.heroVideoPublicId = result.public_id;
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/home/images (admin, multipart: images[])
router.post('/images', protect, adminOnly, upload.array('images', 10), async (req, res) => {
  try {
    const doc = await getOrCreateHome();
    if (req.files?.length) {
      const uploaded = await Promise.all(
        req.files.map((f) => uploadBufferToCloudinary(f.buffer, { folder: 'bdpedia/home', resourceType: 'image' }))
      );
      doc.heroImages.push(...uploaded.map((r) => ({ url: r.secure_url, publicId: r.public_id, caption: '' })));
      await doc.save();
    }
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/home/images/:imageId/activate (admin) - moves this image to the
// front so it becomes the one used as the hero background/poster
router.patch('/images/:imageId/activate', protect, adminOnly, async (req, res) => {
  try {
    const doc = await getOrCreateHome();
    const idx = doc.heroImages.findIndex((img) => img._id.toString() === req.params.imageId);
    if (idx === -1) return res.status(404).json({ message: 'Image not found' });
    const [chosen] = doc.heroImages.splice(idx, 1);
    doc.heroImages.unshift(chosen);
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/home/images/:imageId/caption (admin)
router.put('/images/:imageId/caption', protect, adminOnly, async (req, res) => {
  try {
    const doc = await getOrCreateHome();
    const img = doc.heroImages.id(req.params.imageId);
    if (!img) return res.status(404).json({ message: 'Image not found' });
    img.caption = req.body.caption || '';
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/home/images/:imageId (admin)
router.delete('/images/:imageId', protect, adminOnly, async (req, res) => {
  try {
    const doc = await getOrCreateHome();
    const img = doc.heroImages.id(req.params.imageId);
    if (img) {
      await deleteFromCloudinary(img.publicId);
      img.deleteOne();
      await doc.save();
    }
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
