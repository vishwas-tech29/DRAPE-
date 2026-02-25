const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[6-9]\d{9}$/,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
  },
  profilePhoto: {
    type: String,
  },
  city: {
    type: String,
    enum: ['Hyderabad', 'Bangalore'],
    required: true,
  },
  stylePreferences: {
    preferredCategories: [{
      type: String,
      enum: ['ethnic', 'western', 'fusion', 'accessories', 'footwear', 'jewelry'],
    }],
    styleVibe: {
      type: String,
      enum: ['minimal', 'bold', 'casual', 'traditional'],
    },
    genderPreference: {
      type: String,
      enum: ['male', 'female', 'unisex'],
    },
    bodyType: {
      type: String,
      enum: ['slim', 'athletic', 'curvy', 'plus-size'],
    },
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  deviceTokens: [{
    type: String,
  }],
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  totalCashbackEarned: {
    type: Number,
    default: 0,
  },
  cashbackAvailable: {
    type: Number,
    default: 0,
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active',
  },
  refreshToken: {
    type: String,
  },
}, {
  timestamps: true,
});

userSchema.index({ phoneNumber: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ city: 1 });

userSchema.pre('save', async function(next) {
  if (!this.referralCode && this.isNew) {
    this.referralCode = `DRAPE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
