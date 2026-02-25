const express = require('express');
const router = express.Router();
const { sellerProtect } = require('../middleware/auth');
const { sendSuccess } = require('../utils/response');
const Order = require('../models/Order');
const Product = require('../models/Product');
const SearchLog = require('../models/SearchLog');
const redis = require('../config/redis');

router.get('/overview', sellerProtect, async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const cacheKey = `${process.env.CACHE_VERSION}:analytics:${req.seller._id}:${from}:${to}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);

    const orders = await Order.find({
      sellerId: req.seller._id,
      ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
    });

    const products = await Product.find({ sellerId: req.seller._id });

    const totalViews = products.reduce((sum, p) => sum + p.viewCount, 0);
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.orderTotal, 0);
    const conversionRate = totalViews > 0 ? (totalOrders / totalViews) * 100 : 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const data = {
      totalViews,
      totalOrders,
      totalRevenue,
      conversionRate: Math.round(conversionRate * 100) / 100,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    };

    const response = { success: true, message: 'Analytics overview', data };
    await redis.setex(cacheKey, 300, JSON.stringify(response));

    return res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/search-terms', sellerProtect, async (req, res, next) => {
  try {
    const products = await Product.find({ sellerId: req.seller._id }).select('_id');
    const productIds = products.map(p => p._id);

    const searchTerms = await SearchLog.aggregate([
      { $match: { productsClicked: { $in: productIds } } },
      { $group: { _id: '$searchQuery', impressions: { $sum: 1 }, clicks: { $sum: 1 } } },
      { $sort: { impressions: -1 } },
      { $limit: 20 },
    ]);

    return sendSuccess(res, searchTerms, 'Search terms retrieved');
  } catch (error) {
    next(error);
  }
});

router.get('/products-performance', sellerProtect, async (req, res, next) => {
  try {
    const products = await Product.find({ sellerId: req.seller._id })
      .select('productName viewCount cartAddCount purchaseCount')
      .sort({ viewCount: -1 })
      .lean();

    const performance = products.map(p => ({
      ...p,
      conversionRate: p.viewCount > 0 ? ((p.purchaseCount / p.viewCount) * 100).toFixed(2) : 0,
    }));

    return sendSuccess(res, performance, 'Product performance retrieved');
  } catch (error) {
    next(error);
  }
});

router.get('/traffic-sources', sellerProtect, async (req, res, next) => {
  try {
    const products = await Product.find({ sellerId: req.seller._id }).select('_id');
    const productIds = products.map(p => p._id);

    const sources = await SearchLog.aggregate([
      { $match: { productsClicked: { $in: productIds } } },
      { $group: { _id: '$searchType', count: { $sum: 1 } } },
    ]);

    const total = sources.reduce((sum, s) => sum + s.count, 0);
    const breakdown = sources.map(s => ({
      source: s._id,
      count: s.count,
      percentage: total > 0 ? ((s.count / total) * 100).toFixed(2) : 0,
    }));

    return sendSuccess(res, breakdown, 'Traffic sources retrieved');
  } catch (error) {
    next(error);
  }
});

router.get('/customer-insights', sellerProtect, async (req, res, next) => {
  try {
    const orders = await Order.find({ sellerId: req.seller._id }).populate('buyerId', 'city');

    const cityBreakdown = {};
    orders.forEach(o => {
      const city = o.buyerId?.city || 'Unknown';
      cityBreakdown[city] = (cityBreakdown[city] || 0) + 1;
    });

    return sendSuccess(res, { cityBreakdown }, 'Customer insights retrieved');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
