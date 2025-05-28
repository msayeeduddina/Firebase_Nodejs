const express = require("express");
const itemController = require("../controllers/itemController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Backend: All item routes are protected by the authentication middleware.
// Security: Ensures only authenticated users can access these API endpoints.
router.use(authMiddleware.authenticateToken);

router.get("/", itemController.getItems);
router.post("/", itemController.createItem);
router.put("/:id", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

module.exports = router;