import express from 'express';
import upload from '../middleware/upload.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from './cloudinaryUpload.js';
import { makeSlug } from './slug.js';

/**
 * Builds a full CRUD router for a given Mongoose model.
 *   GET    /            -> list (public)
 *   GET    /:idOrSlug    -> single (public)
 *   POST   /            -> create (admin) [multipart: coverImage, images[]]
 *   PUT    /:id         -> update (admin) [multipart optional]
 *   DELETE /:id         -> delete (admin)
 *   POST   /:id/images  -> add one more image to an existing item (admin)
 *   DELETE /:id/images/:imageId -> remove one image (admin)
 *
 * folder: cloudinary folder name for this section's uploads.
 * sort: optional custom sort spec. Defaults to "newest admin-added item
 *   first" ({ order: 1, createdAt: -1 }), which is what most sections
 *   (places, blogs, culture, gallery, history) want. Sections with a
 *   curated/static base list (districts, rivers) pass { order: 1, createdAt: 1 }
 *   instead, combined with a high default `order` on brand-new items, so the
 *   curated items keep their fixed position and newly-added ones are
 *   appended at the end instead of jumping to the front.
 */
export function buildCrudRouter(Model, folder, sort = { order: 1, createdAt: -1 }) {
  const router = express.Router();

  // LIST
  router.get('/', async (req, res) => {
    try {
      const items = await Model.find().sort(sort);
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // SINGLE (by mongo _id or slug)
  router.get('/:idOrSlug', async (req, res) => {
    try {
      const { idOrSlug } = req.params;
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
      const item = isObjectId
        ? await Model.findById(idOrSlug)
        : await Model.findOne({ slug: idOrSlug });
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // CREATE
  router.post(
    '/',
    protect,
    adminOnly,
    upload.fields([
      { name: 'coverImage', maxCount: 1 },
      { name: 'images', maxCount: 20 },
    ]),
    async (req, res) => {
      try {
        const body = { ...req.body };
        if (body.extra && typeof body.extra === 'string') {
          try { body.extra = JSON.parse(body.extra); } catch { body.extra = {}; }
        }
        if (body.budget && typeof body.budget === 'string') {
          try { body.budget = JSON.parse(body.budget); } catch { delete body.budget; }
        }
        if (body.districts && typeof body.districts === 'string') {
          try { body.districts = JSON.parse(body.districts); } catch { body.districts = []; }
        }
        if (body.content && typeof body.content === 'string') {
          try { body.content = JSON.parse(body.content); } catch { body.content = [body.content]; }
        }
        if (typeof body.featured === 'string') body.featured = body.featured === 'true';

        if (!body.slug && body.title) body.slug = makeSlug(body.title);

        if (req.files?.coverImage?.[0]) {
          const result = await uploadBufferToCloudinary(req.files.coverImage[0].buffer, {
            folder: `bdpedia/${folder}`,
            resourceType: 'image',
          });
          body.coverImage = result.secure_url;
          body.coverImagePublicId = result.public_id;
        }

        if (req.files?.images?.length) {
          const uploaded = await Promise.all(
            req.files.images.map((f) =>
              uploadBufferToCloudinary(f.buffer, { folder: `bdpedia/${folder}`, resourceType: 'image' })
            )
          );
          body.images = uploaded.map((r) => ({ url: r.secure_url, publicId: r.public_id, caption: '' }));
        }

        const item = await Model.create(body);
        res.status(201).json(item);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }
  );

  // UPDATE
  router.put(
    '/:id',
    protect,
    adminOnly,
    upload.fields([
      { name: 'coverImage', maxCount: 1 },
      { name: 'images', maxCount: 20 },
    ]),
    async (req, res) => {
      try {
        const item = await Model.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });

        const body = { ...req.body };
        if (body.extra && typeof body.extra === 'string') {
          try { body.extra = JSON.parse(body.extra); } catch { delete body.extra; }
        }
        if (body.budget && typeof body.budget === 'string') {
          try { body.budget = JSON.parse(body.budget); } catch { delete body.budget; }
        }
        if (body.districts && typeof body.districts === 'string') {
          try { body.districts = JSON.parse(body.districts); } catch { delete body.districts; }
        }
        if (body.content && typeof body.content === 'string') {
          try { body.content = JSON.parse(body.content); } catch { body.content = [body.content]; }
        }
        if (typeof body.featured === 'string') body.featured = body.featured === 'true';

        if (body.title && !req.body.slug) body.slug = makeSlug(body.title);

        if (req.files?.coverImage?.[0]) {
          if (item.coverImagePublicId) await deleteFromCloudinary(item.coverImagePublicId);
          const result = await uploadBufferToCloudinary(req.files.coverImage[0].buffer, {
            folder: `bdpedia/${folder}`,
            resourceType: 'image',
          });
          body.coverImage = result.secure_url;
          body.coverImagePublicId = result.public_id;
        }

        if (req.files?.images?.length) {
          const uploaded = await Promise.all(
            req.files.images.map((f) =>
              uploadBufferToCloudinary(f.buffer, { folder: `bdpedia/${folder}`, resourceType: 'image' })
            )
          );
          const newImgs = uploaded.map((r) => ({ url: r.secure_url, publicId: r.public_id, caption: '' }));
          body.images = [...(item.images || []), ...newImgs];
        }

        Object.assign(item, body);
        await item.save();
        res.json(item);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }
  );

  // DELETE
  router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Not found' });

      if (item.coverImagePublicId) await deleteFromCloudinary(item.coverImagePublicId);
      if (item.images?.length) {
        await Promise.all(item.images.map((img) => deleteFromCloudinary(img.publicId)));
      }
      await item.deleteOne();
      res.json({ message: 'Deleted successfully', id: req.params.id });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Remove a single image from an item's gallery (admin)
  router.delete('/:id/images/:imageId', protect, adminOnly, async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      const img = item.images.id(req.params.imageId);
      if (img) {
        await deleteFromCloudinary(img.publicId);
        img.deleteOne();
        await item.save();
      }
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
}
