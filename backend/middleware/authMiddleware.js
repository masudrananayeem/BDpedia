import { firebaseAuth } from '../config/firebaseAdmin.js';
import User from '../models/User.js';

// Looks up (or, on first sign-in, creates) the MongoDB profile that matches
// a verified Firebase user. Auto-provisioning here means the frontend never
// needs separate /register or /login backend calls — Firebase handles the
// credential, and the very first authenticated request creates the profile.
async function findOrCreateUser(decoded) {
  let user = await User.findOne({ firebaseUid: decoded.uid });
  if (user) return user;

  const email = (decoded.email || '').toLowerCase();
  // Edge case: someone already has a profile under this email (shouldn't
  // normally happen post-migration, but keeps old data linked if it does).
  if (email) {
    user = await User.findOne({ email });
    if (user) {
      user.firebaseUid = decoded.uid;
      await user.save();
      return user;
    }
  }

  return User.create({
    firebaseUid: decoded.uid,
    name: decoded.name || (email ? email.split('@')[0] : 'BDpedia User'),
    email,
    profilePicture: decoded.picture || '',
  });
}

// Verifies the Firebase ID token, attaches req.user
export async function protect(req, res, next) {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'You must be logged in to access this route' });
  }

  if (!firebaseAuth) {
    return res.status(500).json({ message: 'Firebase Admin is not configured on the server' });
  }

  try {
    const decoded = await firebaseAuth.verifyIdToken(token);
    req.user = await findOrCreateUser(decoded);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired, please login again' });
  }
}

// Only allow admin role
export function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access is required for this action' });
}

// Attach req.user if a valid token is present, but doesn't block if absent
// (used for guest-vs-logged-in behavior on public read routes)
export async function optionalAuth(req, _res, next) {
  let token;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) token = header.split(' ')[1];
  if (!token || !firebaseAuth) return next();
  try {
    const decoded = await firebaseAuth.verifyIdToken(token);
    req.user = await findOrCreateUser(decoded);
  } catch (_e) {
    // ignore invalid token for optional routes
  }
  next();
}
