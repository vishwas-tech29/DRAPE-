const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendSuccess, sendSuccessWithPagination } = require('../utils/response');
const Product = require('../models/Product');
const redis = require('../config/redis');

router.get('/', async (req, res, next) => {
  try {
    const { category, city, minPrice, maxPrice, size, color, sort = '-createdAt', page = 1, limit = 20 } = req.query;

    const filter = { isLive: true };

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (size) filter.sizesAvailable = size;
    if (color) filter['colorsAvailable.colorName'] = new RegExp(color, 'i');

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('sellerId', 'shopName city')
      .lean();

    const total = await Product.countDocuments(filter);

    return sendSuccessWithPagination(res, products, { total, page: parseInt(page), limit: parseInt(limit) }, 'Products retrieved');
  } catch (error) {
    next(error);
  }
});

router.get('/:productId', async (req, res, next) => {
  try {
    const cacheKey = `${process.env.CACHE_VERSION}:product:${req.params.productId}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const product = await Product.findById(req.params.productId)
      .populate('sellerId', 'shopName city rating')
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
    }

    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isLive: true,
    })
      .limit(8)
      .lean();

    const response = {
      success: true,
      message: 'Product details retrieved',
      data: { ...product, similarProducts },
    };

    await redis.setex(cacheKey, 900, JSON.stringify(response));

    return res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/:productId/view', async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(req.params.productId, {
      $inc: { viewCount: 1 },
    });

    return sendSuccess(res, null, 'View tracked');
  } catch (error) {
    next(error);
  }
});

router.get('/seller/:sellerId', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      sellerId: req.params.sellerId,
      isLive: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments({ sellerId: req.params.sellerId, isLive: true });

    return sendSuccessWithPagination(res, products, { total, page: parseInt(page), limit: parseInt(limit) }, 'Seller products retrieved');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
