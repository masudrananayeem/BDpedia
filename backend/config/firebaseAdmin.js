// Firebase Admin SDK setup, used to verify the ID tokens the frontend sends
// with every request (feature #3: auth is fully backed by Firebase now).
//
// Get these three values from: Firebase Console > Project settings >
// Service accounts > Generate new private key. That downloads a JSON file
// with "project_id", "client_email" and "private_key" — copy them into
// backend/.env (see .env.example).
import 'dotenv/config';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Private keys from .env usually have literal "\n" sequences — turn them
  // back into real newlines.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      '[BDpedia backend] Firebase Admin credentials are missing. Set FIREBASE_PROJECT_ID, ' +
      'FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in backend/.env — see .env.example.'
    );
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
  }
}

export const firebaseAdmin = admin;
export const firebaseAuth = admin.apps.length ? admin.auth() : null;
