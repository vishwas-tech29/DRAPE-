const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendSuccessWithPagination } = require('../utils/response');
const Product = require('../models/Product');
const redis = require('../config/redis');

router.get('/', protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const cacheKey = `${process.env.CACHE_VERSION}:feed:${req.user._id}:${page}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const skip = (page - 1) * limit;
    const userPreferences = req.user.stylePreferences?.preferredCategories || [];

    const matchingProducts = await Product.find({
      isLive: true,
      category: { $in: userPreferences },
    })
      .populate('sellerId', 'shopName city')
      .limit(Math.floor(limit * 0.6))
      .lean();

    const trendingProducts = await Product.find({
      isLive: true,
      updatedAt: { $gte: new Date(Date.now() - 48 * 60 * 60 * 1000) },
    })
      .sort({ viewCount: -1 })
      .limit(Math.floor(limit * 0.2))
      .populate('sellerId', 'shopName city')
      .lean();

    const newProducts = await Product.find({
      isLive: true,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    })
      .sort({ createdAt: -1 })
      .limit(Math.floor(limit * 0.2))
      .populate('sellerId', 'shopName city')
      .lean();

    const feed = [...matchingProducts, ...trendingProducts, ...newProducts]
      .slice(skip, skip + parseInt(limit));

    const total = await Product.countDocuments({ isLive: true });

    const response = {
      success: true,
      message: 'Feed retrieved',
      data: feed,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    };

    await redis.setex(cacheKey, 300, JSON.stringify(response));

    return res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/trending', protect, async (req, res, next) => {
  try {
    const cacheKey = `${process.env.CACHE_VERSION}:trending:${req.user.city}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const products = await Product.find({
      isLive: true,
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    })
      .sort({ viewCount: -1, cartAddCount: -1 })
      .limit(50)
      .populate('sellerId', 'shopName city')
      .lean();

    const response = {
      success: true,
      message: 'Trending products retrieved',
      data: products,
    };

    await redis.setex(cacheKey, 600, JSON.stringify(response));

    return res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/for-you', protect, async (req, res, next) => {
  try {
    const products = await Product.find({ isLive: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('sellerId', 'shopName city')
      .lean();

    return sendSuccessWithPagination(res, products, { total: products.length, page: 1, limit: 20 }, 'Personalized feed retrieved');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
