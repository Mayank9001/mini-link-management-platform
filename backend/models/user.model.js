const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please provide a valid email address"],
    },
    mobileNo: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Please provide a valid 10-digit mobile number"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
