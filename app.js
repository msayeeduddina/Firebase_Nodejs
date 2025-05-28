// Import the required modules
const express = require('express');
const admin = require('firebase-admin');

// Initialize the Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Load the Firebase service account key
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Define the port on which the server will listen
const PORT = 3000;

// Initialize Firestore database
const db = admin.firestore();

// Define a route to fetch data from Firestore
app.get('/items', async (req, res) => {
  try {
    const snapshot = await db.collection('FirebaseNodejsExample').get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Define a route to create a new item in Firestore
app.post('/items', async (req, res) => {
  try {
    const newItem = req.body;
    const docRef = await db.collection('FirebaseNodejsExample').add(newItem);
    res.status(201).json({ id: docRef.id, ...newItem });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Define a route to update an existing item in Firestore
app.put('/items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedItem = req.body;
    await db.collection('FirebaseNodejsExample').doc(itemId).update(updatedItem);
    res.json({ id: itemId, ...updatedItem });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Define a route to delete an item from Firestore
app.delete('/items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    await db.collection('FirebaseNodejsExample').doc(itemId).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server and log the port number
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// Handle process termination signals
process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});