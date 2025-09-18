const express = require("express");
const {
  uploadPDF,
  getUserPDFs,
  getPDF,
  deletePDF,
  renamePDF,
} = require("../controllers/pdfController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/upload", protect, upload.single("pdf"), uploadPDF);
router.get("/", protect, getUserPDFs);
router.get("/:uuid", protect, getPDF);
router.delete("/:uuid", protect, deletePDF);
router.put("/:uuid/rename", protect, renamePDF);

module.exports = router;
