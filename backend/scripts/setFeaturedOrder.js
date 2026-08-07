// Puts the most well-known districts and the most-visited places at the top
// of their listing pages (Districts / Explore), while everything else stays
// below in normal order. The list pages already sort by `order` ascending
// (see utils/crudFactory.js), so this script just assigns a low (negative)
// order number to the curated names below -- nothing else changes.
//
// Run locally:  node scripts/setFeaturedOrder.js
// Safe to re-run any time; edit the two lists below and re-run to change
// the featured set later (or just do it from the Admin panel per-item by
// leaving the "order" style field... currently order isn't exposed in the
// admin form, so use this script whenever you want to update the ranking).

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import District from '../models/District.js';
import Place from '../models/Place.js';

// Listed in the priority order you want them to appear (#1 shows first).
const FEATURED_DISTRICTS = [
  'Dhaka',
  "Cox's Bazar",
  'Chattogram',
  'Sylhet',
  'Khulna',
  'Rajshahi',
  'Rangpur',
  'Barishal',
  'Mymensingh',
  'Bandarban',
  'Rangamati',
  'Khagrachari',
  'Narayanganj',
  'Gazipur',
  'Bogura',
  'Cumilla',
  'Jashore',
  'Sunamganj',
  'Moulvibazar',
  'Noakhali',
];

const FEATURED_PLACES = [
  "Cox's Bazar Beach",
  'Sajek Valley',
  'Sundarbans',
  'Saint Martin\'s Island',
  'Tanguar Haor',
  'Sreemangal Tea Gardens',
  'Ratargul Swamp Forest',
  'Jaflong',
  'Bisanakandi',
  'Kuakata Beach',
  'Patenga Sea Beach',
  "Foy's Lake",
  'Himchari National Park',
  'Nilgiri',
  'Chimbuk Hill',
  'Boga Lake',
  'Amiakhum Waterfall',
  'Nafakhum Waterfall',
  'Rangamati Hanging Bridge',
  'Lalbagh Fort',
  'Ahsan Manzil',
  'Sonargaon',
  'Panam Nagar',
  'Mahasthangarh',
  'Somapura Mahavihara',
  'Sixty Dome Mosque',
  'Kantajew Temple',
  "Cox's Bazar Marine Drive",
];

async function run() {
  await connectDB();

  let dCount = 0;
  for (let i = 0; i < FEATURED_DISTRICTS.length; i++) {
    const res = await District.updateOne(
      { title: new RegExp(`^${FEATURED_DISTRICTS[i]}$`, 'i') },
      { $set: { order: -1000 + i } }
    );
    if (res.matchedCount) dCount++;
    else console.warn(`⚠ District not found (check spelling): ${FEATURED_DISTRICTS[i]}`);
  }
  console.log(`✔ Featured districts set: ${dCount}/${FEATURED_DISTRICTS.length}`);

  let pCount = 0;
  for (let i = 0; i < FEATURED_PLACES.length; i++) {
    const res = await Place.updateOne(
      { title: new RegExp(`^${FEATURED_PLACES[i]}$`, 'i') },
      { $set: { order: -1000 + i } }
    );
    if (res.matchedCount) pCount++;
    else console.warn(`⚠ Place not found (check spelling): ${FEATURED_PLACES[i]}`);
  }
  console.log(`✔ Featured places set: ${pCount}/${FEATURED_PLACES.length}`);

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
