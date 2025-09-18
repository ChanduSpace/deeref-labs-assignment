const mongoose = require("mongoose");

const highlightSchema = new mongoose.Schema({
  pdf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PDF",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  position: {
    boundingRect: {
      x1: Number,
      y1: Number,
      x2: Number,
      y2: Number,
      width: Number,
      height: Number,
    },
    rects: [
      {
        x1: Number,
        y1: Number,
        x2: Number,
        y2: Number,
        width: Number,
        height: Number,
      },
    ],
    pageNumber: Number,
  },
  comment: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Highlight", highlightSchema);
