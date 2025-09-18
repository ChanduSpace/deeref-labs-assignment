const express = require("express");
const {
  createHighlight,
  getHighlights,
  updateHighlight,
  deleteHighlight,
} = require("../controllers/highlightController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createHighlight);
router.get("/:uuid", protect, getHighlights);
router.put("/:id", protect, updateHighlight);
router.delete("/:id", protect, deleteHighlight);

module.exports = router;
