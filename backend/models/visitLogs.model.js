const mongoose = require("mongoose");

const VisitLogSchema = new mongoose.Schema({
  shortLink: {
    type: String,
    required: true,
    index: true, // For faster lookups
  },
  originalLink: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    enum: ["Mobile", "Desktop", "Tablet"], // Represents the type of device
    required: true,
  },
  platform: {
    type: String,
    enum: ["Android", "iOS", "Chrome", 'Windows'], // Represents the operating system or browser
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Auto-generated visit time
  },
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', // Reference to the User model
  //   required: true,
  // },
});

const VisitLog = mongoose.model("VisitLog", VisitLogSchema);

module.exports = VisitLog;
