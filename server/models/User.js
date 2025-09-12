const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // bcrypt hash
  role: { type: String, enum: ["user", "admin"], default: "user" },
  status: { type: String, enum: ["active", "deactivated"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
