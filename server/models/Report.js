const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  reporterEmail: { type: String, required: false },
  ip: { type: String },
  userAgent: { type: String },
  url: { type: String, required: true },
  rawText: { type: String },
  verdict: {
    type: String,
    enum: ["malicious", "suspicious", "likely_safe", "pending"],
    default: "pending",
  },
  score: { type: Number },
  reasons: [{ type: String }],
  status: {
    type: String,
    enum: ["open", "reviewed", "dismissed"],
    default: "open",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
