const Report = require("../models/Report");
const { validationResult, body } = require("express-validator");

// Submit a phishing report (user or guest)
exports.submitReport = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { url, rawText } = req.body;
    const report = new Report({
      reporter: req.user ? req.user._id : undefined,
      reporterEmail: req.user ? req.user.email : req.body.reporterEmail,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      url,
      rawText,
      status: "open",
    });
    await report.save();
    res.status(201).json({ message: "Report submitted", report });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get current user's reports
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user._id });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: list all reports
exports.listReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("reporter", "email name");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: update report status
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    report.status = req.body.status || report.status;
    report.verdict = req.body.verdict || report.verdict;
    await report.save();
    res.json({ message: "Report updated", report });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
