require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

mongoose.connect(process.env.MONGO_URI);

(async () => {
  const exists = await User.findOne({ email: "admin@test.com" });

  if (!exists) {
    await User.create({
      name: "Admin",
      email: "admin@test.com",
      password: await bcrypt.hash("123456", 10),
      role: "admin"
    });
    console.log("Admin created");
  }

  process.exit();
})();
