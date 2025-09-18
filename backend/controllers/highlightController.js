const Highlight = require("../models/Highlight");
const PDF = require("../models/PDF");

// Create highlight
exports.createHighlight = async (req, res) => {
  try {
    const { pdfUuid, text, page, position, comment } = req.body;

    // Find PDF by UUID
    const pdf = await PDF.findOne({ uuid: pdfUuid, user: req.user.id });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const highlight = new Highlight({
      pdf: pdf._id,
      user: req.user.id,
      text,
      page,
      position,
      comment: comment || "",
    });

    await highlight.save();

    // Populate related fields
    await highlight.populate("pdf", "uuid originalName");
    await highlight.populate("user", "email");

    res.status(201).json(highlight);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Get highlights for a PDF
exports.getHighlights = async (req, res) => {
  try {
    const pdf = await PDF.findOne({
      uuid: req.params.uuid,
      user: req.user.id,
    });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const highlights = await Highlight.find({
      pdf: pdf._id,
      user: req.user.id,
    })
      .sort({ createdAt: 1 })
      .populate("pdf", "uuid originalName")
      .populate("user", "email");

    res.json(highlights);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update highlight
exports.updateHighlight = async (req, res) => {
  try {
    const { comment } = req.body;

    const highlight = await Highlight.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { comment },
      { new: true }
    )
      .populate("pdf", "uuid originalName")
      .populate("user", "email");

    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }

    res.json(highlight);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete highlight
exports.deleteHighlight = async (req, res) => {
  try {
    const highlight = await Highlight.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }

    res.json({ message: "Highlight deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
