const admin = require("firebase-admin");
// Backend: Using dotenv for secure loading of service account key path.
require("dotenv").config();

const serviceAccount = require("./serviceAccountKey.json");

// Backend: Initialize Firebase Admin SDK using a service account for secure server-side operations.
// Architecture: Centralized Firebase Admin SDK initialization ensures single point of configuration.
try {
  if (!serviceAccount) {
    throw new Error("serviceAccount: serviceAccountKey is not available");
  }
//   const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error("Failed to initialize Firebase Admin SDK:", error.message);
  // System Design: Critical error, application should not proceed without Firebase Admin initialized.
  process.exit(1);
}

// Backend: Expose the Firestore database instance.
const db = admin.firestore();

module.exports = { admin, db };