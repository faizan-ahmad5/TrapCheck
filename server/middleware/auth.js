const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT and attach user to request
module.exports = function (roles = []) {
  // roles param can be a single role string (e.g., 'admin') or array of roles
  if (typeof roles === "string") roles = [roles];

  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) return res.status(401).json({ error: "User not found" });
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient role" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};
