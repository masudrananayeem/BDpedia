// Run locally (VS Code terminal) AFTER the person has signed up for a normal
// account (via the site's Register page, using email/password or Google)
// with the email you want to promote.
//
// Usage:
//   node scripts/makeAdmin.js someone@example.com
//   (or)  npm run make-admin -- someone@example.com
//
// This is the "no separate admin login" approach: the same /login form is
// used (backed by Firebase Auth), but this script flips role: 'user' ->
// 'admin' directly in MongoDB. After running it, that account gets
// redirected to /admin automatically because req.user.role === 'admin'.

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email: node scripts/makeAdmin.js someone@example.com');
  process.exit(1);
}

async function run() {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.error(`No account found for "${email}". Please sign up on the site first, then run this script again.`);
    process.exit(1);
  }
  user.role = 'admin';
  await user.save();
  console.log(`✔ "${email}" is now an admin. Logging into /login with that account will now redirect to the /admin panel.`);
  await mongoose.disconnect();
}

run();
