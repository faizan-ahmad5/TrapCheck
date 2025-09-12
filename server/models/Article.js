const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  content: { type: String, required: true }, // markdown
  status: {
    type: String,
    enum: ["pending", "published", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Article", articleSchema);
