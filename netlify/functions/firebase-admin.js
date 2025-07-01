// netlify/functions/firebase-admin.js
const admin = require('firebase-admin');

// Decode the base64 service account key from environment variables
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
if (!serviceAccountBase64) {
    throw new Error('Firebase service account key not found in environment variables.');
}
const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('ascii'));

// Initialize Firebase Admin SDK if it hasn't been already
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
    });
    console.log('Firebase Admin Initialized.');
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

module.exports = admin;
