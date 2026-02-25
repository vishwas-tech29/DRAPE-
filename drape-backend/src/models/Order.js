const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    productNameSnapshot: String,
    selectedColor: String,
    selectedSize: String,
    quantity: Number,
    unitPrice: Number,
    productPhotoSnapshot: String,
  }],
  orderTotal: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'cod'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  deliveryAddress: {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    pincode: String,
  },
  deliveryStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'placed',
  },
  trackingNumber: {
    type: String,
  },
  sellerNotes: {
    type: String,
  },
  buyerNotes: {
    type: String,
  },
  estimatedDeliveryDate: {
    type: Date,
  },
  actualDeliveryDate: {
    type: Date,
  },
  cancellationReason: {
    type: String,
  },
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'processed'],
    default: 'none',
  },
  commissionAmount: {
    type: Number,
    default: 0,
  },
  commissionRate: {
    type: Number,
    default: 0,
  },
  netSellerPayout: {
    type: Number,
    default: 0,
  },
  payoutStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  payoutDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ sellerId: 1, deliveryStatus: 1, createdAt: -1 });
orderSchema.index({ razorpayOrderId: 1 });

module.exports = mongoose.model('Order', orderSchema);
