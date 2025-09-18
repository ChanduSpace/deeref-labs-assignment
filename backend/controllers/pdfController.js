const PDF = require("../models/PDF");
const Highlight = require("../models/Highlight");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

// Upload PDF
exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pdf = new PDF({
      uuid: req.file.filename.split(".")[0], // Remove extension to get UUID
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      user: req.user.id,
    });

    await pdf.save();

    // Populate user field with email only
    await pdf.populate("user", "email");

    res.status(201).json(pdf);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Get all PDFs for a user
exports.getUserPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find({ user: req.user.id })
      .sort({ uploadDate: -1 })
      .populate("user", "email");

    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single PDF
exports.getPDF = async (req, res) => {
  try {
    const pdf = await PDF.findOne({
      uuid: req.params.uuid,
      user: req.user.id,
    }).populate("user", "email");

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    res.json(pdf);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete PDF
exports.deletePDF = async (req, res) => {
  try {
    const pdf = await PDF.findOne({
      uuid: req.params.uuid,
      user: req.user.id,
    });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Delete file from filesystem
    try {
      if (fs.existsSync(pdf.path)) {
        fs.unlinkSync(pdf.path);
      }
    } catch (err) {
      console.warn("File not found or already deleted:", pdf.path);
    }

    // Delete highlights associated with this PDF
    await Highlight.deleteMany({ pdf: pdf._id });

    // Delete PDF record
    await PDF.findByIdAndDelete(pdf._id);

    res.json({ message: "PDF deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Rename PDF
exports.renamePDF = async (req, res) => {
  try {
    const { originalName } = req.body;

    const pdf = await PDF.findOneAndUpdate(
      { uuid: req.params.uuid, user: req.user.id },
      { originalName },
      { new: true }
    ).populate("user", "email");

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    res.json(pdf);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
