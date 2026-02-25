const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  periodStart: {
    type: Date,
    required: true,
  },
  periodEnd: {
    type: Date,
    required: true,
  },
  totalOrdersCount: {
    type: Number,
    default: 0,
  },
  grossAmount: {
    type: Number,
    required: true,
  },
  totalCommission: {
    type: Number,
    required: true,
  },
  netAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'failed'],
    default: 'pending',
  },
  razorpayPayoutId: {
    type: String,
  },
  paidAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

payoutSchema.index({ sellerId: 1, createdAt: -1 });
payoutSchema.index({ status: 1 });

module.exports = mongoose.model('Payout', payoutSchema);
