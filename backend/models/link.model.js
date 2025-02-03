const mongoose = require('mongoose');
const { Schema } = mongoose;

const linkSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User collection
    required: true,
  },
  originalLink: {
    type: String,
    required: true,
    trim: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
  expirationDate: {
    type: Date, // If null or not set, the link doesn't expire
    default: null,
  },
  shortLink: {
    type: String,
    required: true,
    unique: true,
  },
  clicks: {
    type: Number, // Keeps track of the number of visits
    default: 0,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active', // Default to Active
  },
}, {
  timestamps: true, // Automatically adds createdAt (link creation date) and updatedAt fields
});

// Middleware to update the status before saving
linkSchema.pre('save', function (next) {
  if (this.expirationDate && this.expirationDate < new Date()) {
    this.status = 'Inactive';
  } else {
    this.status = 'Active';
  }
  next();
});

// Create the Link model
const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
