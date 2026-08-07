// One-time migration: imports the existing static JSON data (that currently
// ships inside src/data/json in the frontend) into MongoDB, so the admin
// panel has real data to edit from day one.
//
// Run locally:  npm run seed   (or)  node scripts/seedFromJson.js
//
// Safe to re-run: it upserts by slug, so it won't create duplicates.
// NOTE: existing local image paths (e.g. "/images/districts/dhaka.jpg") are
// kept as-is in coverImage for now -- nothing is uploaded to Cloudinary here
// (no images are re-encoded). Replace any item's picture later from the
// admin panel and it will then be converted to WebP on Cloudinary as usual.

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import District from '../models/District.js';
import Place from '../models/Place.js';
import River from '../models/River.js';
import Blog from '../models/Blog.js';
import { makeSlug } from '../utils/slug.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../src/data/json');

function readJsonDir(dir) {
  const full = path.join(DATA_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.json') && f !== 'index.json')
    .map((f) => JSON.parse(fs.readFileSync(path.join(full, f), 'utf-8')));
}

function readJsonFile(rel) {
  const full = path.join(DATA_DIR, rel);
  if (!fs.existsSync(full)) return [];
  return JSON.parse(fs.readFileSync(full, 'utf-8'));
}

async function seedDistricts() {
  // IMPORTANT: iterate in the curated order from districts/index.json (which
  // puts Dhaka and the other main districts first), NOT readJsonDir's
  // alphabetical-by-filename order — otherwise the seeded `order` field
  // (and therefore the public site's district order) ends up scrambled.
  const indexList = readJsonFile('districts/index.json');
  const detailFiles = readJsonDir('districts');
  const detailById = new Map(detailFiles.map((d) => [d.id, d]));

  let n = 0;
  for (const base of indexList) {
    const d = detailById.get(base.id) || base;
    const slug = makeSlug(d.id || d.name);
    await District.findOneAndUpdate(
      { slug },
      {
        title: d.name,
        slug,
        description: d.tourist_places || '',
        coverImage: d.image || '',
        division: d.division || '',
        history: d.history || '',
        touristPlacesSummary: d.tourist_places || '',
        wiki: d.wiki || '',
        order: n + 1, // fixes this district's position in the curated list
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    n++;
  }
  console.log(`✔ Districts seeded: ${n}`);
}

async function seedPlaces() {
  // The frontend keeps a *summary* list of every place in places/index.json
  // (this has ALL of them), plus a handful of individual detail files with
  // slightly longer descriptions for a subset. Seed from index.json so
  // nothing is missed, and use the richer individual file when one exists.
  const indexList = readJsonFile('places/index.json');
  const detailFiles = readJsonDir('places'); // excludes index.json automatically
  const detailById = new Map(detailFiles.map((d) => [d.id, d]));

  let n = 0;
  for (const base of indexList) {
    const p = detailById.get(base.id) || base;
    const slug = makeSlug(p.id || p.name);
    await Place.findOneAndUpdate(
      { slug },
      {
        title: p.name,
        slug,
        description: p.description || '',
        coverImage: p.image || '',
        category: p.category || '',
        district: p.district || '',
        entryFee: p.entryFee || '',
        openingHours: p.openingHours || '',
        wiki: p.wiki || '',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    n++;
  }
  console.log(`✔ Places seeded: ${n}`);
}

async function seedRivers() {
  const rivers = readJsonFile('others/rivers.json');
  let n = 0;
  for (const r of rivers) {
    const slug = makeSlug(r.id || r.name);
    await River.findOneAndUpdate(
      { slug },
      {
        title: r.name,
        slug,
        description: r.description || '',
        coverImage: r.image || '',
        localName: r.localName || '',
        lengthKm: r.length_km || 0,
        origin: r.origin || '',
        districts: r.districts || [],
        wiki: r.wiki || '',
        order: n + 1, // fixes this river's position in the curated list
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    n++;
  }
  console.log(`✔ Rivers seeded: ${n}`);
}

async function seedBlogs() {
  const blogs = readJsonFile('others/blogs.json');
  let n = 0;
  for (const b of blogs) {
    const slug = makeSlug(b.title + '-' + b.id);
    await Blog.findOneAndUpdate(
      { slug },
      {
        title: b.title,
        slug,
        description: b.excerpt || '',
        coverImage: b.image || '',
        author: b.author || 'BDpedia Team',
        category: b.category || 'Travel',
        content: Array.isArray(b.content) ? b.content : [b.content].filter(Boolean),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    n++;
  }
  console.log(`✔ Blogs seeded: ${n}`);
}

async function run() {
  await connectDB();
  await seedDistricts();
  await seedPlaces();
  await seedRivers();
  await seedBlogs();
  console.log('\nDone. The Culture / History / Gallery sections were left empty (no prior JSON data existed) -- add them from the admin panel.');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
