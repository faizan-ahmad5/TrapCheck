// promoteAdmin.js
// Usage: node promoteAdmin.js <email>
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const email = process.argv[2];
if (!email) {
  console.error("Usage: node promoteAdmin.js <email>");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { role: "admin" } },
      { new: true }
    );
    if (user) {
      console.log(`User ${email} promoted to admin.`);
    } else {
      console.log(`User with email ${email} not found.`);
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
