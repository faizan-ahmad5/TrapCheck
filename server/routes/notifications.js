const express = require("express");
const auth = require("../middleware/auth");
const Notification = require("../models/Notification");

const router = express.Router();

// Get notifications for current user
router.get("/", auth(), async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate("article", "title")
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Mark notification as read
router.patch("/:id/read", auth(), async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
