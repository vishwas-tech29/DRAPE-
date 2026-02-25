const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  promotionName: {
    type: String,
    required: true,
    trim: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  appliesTo: {
    type: String,
    enum: ['all-products', 'selected'],
    default: 'all-products',
  },
  selectedProductIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  redemptionCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

promotionSchema.index({ sellerId: 1, isActive: 1 });
promotionSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Promotion', promotionSchema);
