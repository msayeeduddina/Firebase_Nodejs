const { db } = require("../config/firebaseConfig");

class ItemController {
  constructor() {
    this.collectionName = "FirebaseNodejsExample"; // Architecture: Define collection name once.

    // Backend: Bind 'this' context for each method to ensure it refers to the ItemController instance
    // when called as an Express route handler.
    this.getItems = this.getItems.bind(this);
    this.createItem = this.createItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  // Backend: Fetches all items from Firestore.
  async getItems(req, res) {
    try {
      const snapshot = await db.collection(this.collectionName).get(); // 'this.collectionName' will now be correctly defined
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching items:", error.message);
      // Backend: Provide a generic error message to the client, log details internally.
      res.status(500).json({ message: "Failed to retrieve items." });
    }
  }

  // Backend: Creates a new item in Firestore.
  async createItem(req, res) {
    try {
      const newItem = req.body;
      if (!newItem || Object.keys(newItem).length === 0) {
        return res.status(400).json({ message: "Request body cannot be empty." });
      }
      const docRef = await db.collection(this.collectionName).add(newItem);
      res.status(201).json({ id: docRef.id, ...newItem });
    } catch (error) {
      console.error("Error creating item:", error.message);
      res.status(500).json({ message: "Failed to create item." });
    }
  }

  // Backend: Updates an existing item in Firestore.
  async updateItem(req, res) {
    try {
      const itemId = req.params.id;
      const updatedItemData = req.body;
      if (!updatedItemData || Object.keys(updatedItemData).length === 0) {
        return res.status(400).json({ message: "Request body cannot be empty." });
      }

      const docRef = db.collection(this.collectionName).doc(itemId);
      const doc = await docRef.get();

      if (!doc.exists) {
        // System Design: Handle cases where the document to update does not exist.
        return res.status(404).json({ message: "Item not found." });
      }

      await docRef.update(updatedItemData);
      res.status(200).json({ id: itemId, ...updatedItemData });
    } catch (error) {
      console.error("Error updating item:", error.message);
      res.status(500).json({ message: "Failed to update item." });
    }
  }

  // Backend: Deletes an item from Firestore.
  async deleteItem(req, res) {
    try {
      const itemId = req.params.id;
      const docRef = db.collection(this.collectionName).doc(itemId);
      const doc = await docRef.get();

      if (!doc.exists) {
        // System Design: Handle cases where the document to delete does not exist.
        return res.status(404).json({ message: "Item not found." });
      }

      await docRef.delete();
      // Backend: 204 No Content is appropriate for successful deletion without a response body.
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting item:", error.message);
      res.status(500).json({ message: "Failed to delete item." });
    }
  }
}

module.exports = new ItemController();