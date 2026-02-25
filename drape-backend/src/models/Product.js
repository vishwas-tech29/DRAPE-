const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['ethnic', 'western', 'fusion', 'accessories', 'footwear', 'jewelry'],
    required: true,
  },
  subcategory: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  compareAtPrice: {
    type: Number,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  photos: [{
    originalUrl: String,
    optimizedUrl: String,
    thumbnailUrl: String,
    mediumUrl: String,
    largeUrl: String,
    displayOrder: Number,
  }],
  aiGeneratedDesignCards: [{
    designUrl: String,
    styleLabel: String,
    isActive: { type: Boolean, default: false },
  }],
  colorsAvailable: [{
    colorName: String,
    hexCode: String,
    photoIndex: Number,
  }],
  sizesAvailable: [{
    type: String,
  }],
  stockQuantity: {
    type: Number,
    default: 0,
  },
  isInStock: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
  }],
  styleAttributes: {
    fabricType: String,
    pattern: String,
    occasion: String,
    sleeveLength: String,
  },
  sellerHandlesDelivery: {
    type: Boolean,
    default: true,
  },
  deliveryAreas: [{
    type: String,
  }],
  estimatedDeliveryDays: {
    type: Number,
    default: 7,
  },
  isLive: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  boostExpiresAt: {
    type: Date,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  cartAddCount: {
    type: Number,
    default: 0,
  },
  purchaseCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

productSchema.index({ sellerId: 1, isLive: 1 });
productSchema.index({ category: 1, isLive: 1 });
productSchema.index({ tags: 'text', productName: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ viewCount: -1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
