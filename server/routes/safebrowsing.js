// routes/safebrowsing.js
const express = require("express");
const router = express.Router();
const { analyzeUrl } = require("../utils/analyzer");

// POST /api/safebrowsing/check
router.post("/check", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });
  try {
    const result = await analyzeUrl(url);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to analyze URL" });
  }
});

module.exports = router;
