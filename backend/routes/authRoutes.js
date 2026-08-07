import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

const router = express.Router();

// @route POST /api/auth/sync
// Called right after the frontend signs a user in/up with Firebase. The
// `protect` middleware has already verified the Firebase ID token and
// found-or-created the matching MongoDB profile; this route just applies
// any extra details from the sign-up form (name/district) and returns the
// profile.
router.post('/sync', protect, async (req, res) => {
  try {
    const { name, district } = req.body;
    let changed = false;
    if (name && req.user.name !== name) { req.user.name = name; changed = true; }
    if (district !== undefined && req.user.district !== district) { req.user.district = district; changed = true; }
    if (changed) await req.user.save();
    res.json({ user: req.user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

// @route PUT /api/auth/me  (update name/district — password changes now
// happen client-side through Firebase, not through this backend)
router.put('/me', protect, async (req, res) => {
  try {
    const { name, district } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (district !== undefined) user.district = district;

    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route PUT /api/auth/me/picture (multipart: picture)
router.put('/me/picture', protect, upload.single('picture'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Picture file not provided' });
    const user = await User.findById(req.user._id);

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'bdpedia/users',
      resourceType: 'image',
    });

    // best-effort cleanup of old cloudinary picture (skip Google-hosted urls)
    if (user.profilePicture?.includes('res.cloudinary.com')) {
      const match = user.profilePicture.match(/bdpedia\/users\/[^./]+/);
      if (match) await deleteFromCloudinary(match[0]);
    }

    user.profilePicture = result.secure_url;
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
