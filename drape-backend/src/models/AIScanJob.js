const mongoose = require('mongoose');

const aiScanJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  scanType: {
    type: String,
    enum: ['detect-outfit', 'try-on'],
    required: true,
  },
  detectedItems: [{
    label: String,
    confidenceScore: Number,
    boundingBox: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
  }],
  suggestedTags: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['queued', 'processing', 'completed', 'failed'],
    default: 'queued',
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

aiScanJobSchema.index({ userId: 1, createdAt: -1 });
aiScanJobSchema.index({ status: 1 });

module.exports = mongoose.model('AIScanJob', aiScanJobSchema);
