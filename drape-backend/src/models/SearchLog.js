const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  searchQuery: {
    type: String,
    trim: true,
  },
  searchType: {
    type: String,
    enum: ['text', 'photo', 'snap'],
    required: true,
  },
  detectedOutfitTags: [{
    type: String,
  }],
  city: {
    type: String,
  },
  resultsCount: {
    type: Number,
    default: 0,
  },
  productsClicked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  sessionId: {
    type: String,
  },
}, {
  timestamps: true,
});

searchLogSchema.index({ searchQuery: 1, city: 1 });
searchLogSchema.index({ userId: 1, createdAt: -1 });
searchLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SearchLog', searchLogSchema);
