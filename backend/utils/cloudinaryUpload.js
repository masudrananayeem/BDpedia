import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';

/**
 * Uploads a file buffer (from multer memoryStorage) to Cloudinary.
 * Images are always converted/stored as WebP regardless of the original
 * format (jpg/jpeg/png). Videos are uploaded as-is; Cloudinary optimizes
 * delivery automatically.
 */
export function uploadBufferToCloudinary(buffer, opts = {}) {
  const { folder = 'bdpedia', resourceType = 'image' } = opts;

  return new Promise((resolve, reject) => {
    const uploadOptions = { folder, resource_type: resourceType };

    if (resourceType === 'image') {
      uploadOptions.format = 'webp';
      uploadOptions.quality = 'auto';
      uploadOptions.fetch_format = 'auto';
    } else {
      uploadOptions.quality = 'auto';
    }

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export async function deleteFromCloudinary(publicId, resourceType = 'image') {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('[Cloudinary] delete failed:', err.message);
  }
}
