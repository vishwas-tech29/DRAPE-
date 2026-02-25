const mongoose = require('mongoose');

const savedBoardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  boardName: {
    type: String,
    required: true,
    trim: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  coverImage: {
    type: String,
  },
}, {
  timestamps: true,
});

savedBoardSchema.index({ userId: 1 });

module.exports = mongoose.model('SavedBoard', savedBoardSchema);
