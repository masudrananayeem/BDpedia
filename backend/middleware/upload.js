import multer from 'multer';

// Keep files in memory; we stream them straight to Cloudinary from the buffer.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/');
  if (isImage || isVideo) return cb(null, true);
  cb(new Error('Only image (jpg/jpeg/png/webp) or video files can be uploaded'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB ceiling (covers hero videos)
});

export default upload;
