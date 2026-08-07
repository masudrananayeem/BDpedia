import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import guideRoutes from './routes/guideRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import { buildCrudRouter } from './utils/crudFactory.js';

import District from './models/District.js';
import Place from './models/Place.js';
import River from './models/River.js';
import Culture from './models/Culture.js';
import Blog from './models/Blog.js';
import HistoryItem from './models/HistoryItem.js';
import GalleryItem from './models/GalleryItem.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/guide', guideRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);

// One CRUD router per content section (feature #1: admin can add/edit/delete
// images & fields for every section from the same generic panel).
// Districts & rivers are curated, mostly-static lists — keep their fixed
// order and append anything newly added from the admin panel to the end,
// instead of sorting by "newest first" like the other sections.
const CURATED_ORDER = { order: 1, createdAt: 1 };
app.use('/api/districts', buildCrudRouter(District, 'districts', CURATED_ORDER));
app.use('/api/places', buildCrudRouter(Place, 'places'));
app.use('/api/rivers', buildCrudRouter(River, 'rivers', CURATED_ORDER));
app.use('/api/culture', buildCrudRouter(Culture, 'culture'));
app.use('/api/blogs', buildCrudRouter(Blog, 'blogs'));
app.use('/api/history', buildCrudRouter(HistoryItem, 'history'));
app.use('/api/gallery', buildCrudRouter(GalleryItem, 'gallery'));

// central error handler (multer errors etc.)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`[BDpedia backend] running on port ${PORT}`));
});

export default app;
