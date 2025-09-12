const express = require("express");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const { analyzeUrl } = require("../utils/analyzer");

const router = express.Router();

// Rate limiter: 5 requests per minute per IP
const checkerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// @route   POST /api/check-url
// @desc    Analyze a URL for phishing (public, rate-limited)
// @access  Public
router.post(
  "/",
  checkerLimiter,
  [
    body("url").optional().isURL().withMessage("Valid URL required"),
    body("rawText").optional().isString().trim().isLength({ max: 2000 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { url, rawText } = req.body;
    if (!url && !rawText) {
      return res.status(400).json({ error: "url or rawText required" });
    }
    // For now, only analyze url
    const result = analyzeUrl(url || "");
    res.json(result);
  }
);

module.exports = router;
