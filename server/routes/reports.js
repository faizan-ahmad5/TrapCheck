const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const reportController = require("../controllers/reportController");

const router = express.Router();

// Submit phishing report (JWT required)
router.post(
  "/",
  auth(),
  [
    body("url").isURL().withMessage("Valid URL required"),
    body("rawText").optional().isString().trim().isLength({ max: 2000 }),
  ],
  reportController.submitReport
);

// Get current user's reports
router.get("/me", auth(), reportController.getMyReports);

// Admin: list all reports
router.get("/", auth("admin"), reportController.listReports);

// Admin: update report status
router.patch("/:id", auth("admin"), reportController.updateReport);

module.exports = router;
