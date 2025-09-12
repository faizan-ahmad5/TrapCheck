const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Admin: list all users (basic info, no passwords)
router.get("/", auth("admin"), async (req, res) => {
  try {
    const users = await User.find({}, "name email role createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: update user role or status
router.patch("/:id", auth("admin"), async (req, res) => {
  const { role, status } = req.body;
  try {
    const user = await require("../models/User").findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (role) user.role = role;
    if (status) user.status = status;
    await user.save();
    res.json({
      message: "User updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: delete user
router.delete("/:id", auth("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      message: "User deleted",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
