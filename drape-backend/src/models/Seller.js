const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shopName: {
    type: String,
    required: true,
    trim: true,
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  whatsappNumber: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  shopLogo: {
    type: String,
  },
  shopDescription: {
    type: String,
  },
  city: {
    type: String,
    enum: ['Hyderabad', 'Bangalore'],
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  shopType: {
    type: String,
    enum: ['physical-store', 'home-seller', 'online-only', 'independent-designer'],
    required: true,
  },
  categories: [{
    type: String,
    enum: ['ethnic', 'western', 'fusion', 'accessories', 'footwear', 'jewelry'],
  }],
  isVerified: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isOnHoliday: {
    type: Boolean,
    default: false,
  },
  holidayReturnDate: {
    type: Date,
  },
  deliveryAreas: [{
    type: String,
  }],
  estimatedDeliveryDays: {
    type: Number,
    default: 7,
  },
  upiId: {
    type: String,
  },
  bankAccountDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
  },
  payoutPreference: {
    type: String,
    enum: ['weekly', 'monthly'],
    default: 'weekly',
  },
  foundingSeller: {
    type: Boolean,
    default: false,
  },
  totalSalesAmount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalRatingsCount: {
    type: Number,
    default: 0,
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active',
  },
}, {
  timestamps: true,
});

sellerSchema.index({ userId: 1 });
sellerSchema.index({ city: 1, isActive: 1 });
sellerSchema.index({ categories: 1 });

sellerSchema.virtual('commissionRate').get(function() {
  if (this.foundingSeller) return 5;
  if (this.totalSalesAmount < parseFloat(process.env.TRACTION_THRESHOLD || 50000)) return 0;
  return 8;
});

sellerSchema.set('toJSON', { virtuals: true });
sellerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Seller', sellerSchema);
