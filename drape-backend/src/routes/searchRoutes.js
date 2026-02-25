const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { sendSuccess } = require('../utils/response');
const Product = require('../models/Product');
const SearchLog = require('../models/SearchLog');
const AIScanJob = require('../models/AIScanJob');
const imageService = require('../services/imageService');
const { outfitDetectionQueue } = require('../config/queue');
const redis = require('../config/redis');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/text', protect, async (req, res, next) => {
  try {
    const { query, city } = req.body;

    const cacheKey = `${process.env.CACHE_VERSION}:search:${query}:${city}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const products = await Product.find({
      $text: { $search: query },
      isLive: true,
    })
      .populate('sellerId', 'shopName city')
      .limit(50)
      .lean();

    await SearchLog.create({
      userId: req.user._id,
      searchQuery: query,
      searchType: 'text',
      city,
      resultsCount: products.length,
    });

    const response = {
      success: true,
      message: 'Search results',
      data: products,
    };

    await redis.setex(cacheKey, 120, JSON.stringify(response));

    return res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/photo', protect, upload.single('image'), async (req, res, next) => {
  try {
    const imageUrls = await imageService.uploadImage(
      req.file.buffer,
      'search-photos',
      `${req.user._id}-${Date.now()}.jpg`
    );

    const scanJob = await AIScanJob.create({
      userId: req.user._id,
      imageUrl: imageUrls.originalUrl,
      scanType: 'detect-outfit',
      status: 'queued',
    });

    await outfitDetectionQueue.add({
      scanJobId: scanJob._id,
      imageUrl: imageUrls.originalUrl,
    });

    return sendSuccess(res, { jobId: scanJob._id }, 'Photo scan initiated');
  } catch (error) {
    next(error);
  }
});

router.get('/scan-result/:jobId', protect, async (req, res, next) => {
  try {
    const scanJob = await AIScanJob.findById(req.params.jobId);

    if (!scanJob) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Scan job not found' } });
    }

    if (scanJob.status === 'completed' && scanJob.result?.matchedProducts) {
      const products = await Product.find({
        _id: { $in: scanJob.result.matchedProducts },
      }).populate('sellerId', 'shopName city');

      return sendSuccess(res, {
        status: scanJob.status,
        detectedItems: scanJob.detectedItems,
        tags: scanJob.suggestedTags,
        products,
      }, 'Scan completed');
    }

    return sendSuccess(res, { status: scanJob.status }, 'Scan in progress');
  } catch (error) {
    next(error);
  }
});

router.get('/suggestions', protect, async (req, res, next) => {
  try {
    const { query } = req.query;

    const suggestions = await SearchLog.aggregate([
      { $match: { searchQuery: new RegExp(query, 'i') } },
      { $group: { _id: '$searchQuery', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return sendSuccess(res, suggestions.map(s => s._id), 'Suggestions retrieved');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
