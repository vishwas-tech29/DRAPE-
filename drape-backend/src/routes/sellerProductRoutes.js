const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sellerProtect } = require('../middleware/auth');
const { sendSuccess, sendSuccessWithPagination } = require('../utils/response');
const Product = require('../models/Product');
const imageService = require('../services/imageService');
const { productTaggingQueue } = require('../config/queue');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', sellerProtect, upload.array('photos', 10), async (req, res, next) => {
  try {
    const photoUrls = [];

    for (let i = 0; i < req.files.length; i++) {
      const urls = await imageService.uploadImage(
        req.files[i].buffer,
        'products',
        `${req.seller._id}-${Date.now()}-${i}.jpg`
      );

      photoUrls.push({
        originalUrl: urls.originalUrl,
        optimizedUrl: urls.optimizedUrl,
        thumbnailUrl: urls.thumbnailUrl,
        mediumUrl: urls.mediumUrl,
        largeUrl: urls.largeUrl,
        displayOrder: i,
      });
    }

    const product = await Product.create({
      sellerId: req.seller._id,
      ...req.body,
      photos: photoUrls,
      isLive: false,
    });

    if (photoUrls.length > 0) {
      await productTaggingQueue.add({
        productId: product._id,
        imageUrl: photoUrls[0].originalUrl,
      });
    }

    return sendSuccess(res, product, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
});

router.get('/', sellerProtect, async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { sellerId: req.seller._id };
    if (status) filter.isLive = status === 'live';
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    return sendSuccessWithPagination(res, products, { total, page: parseInt(page), limit: parseInt(limit) }, 'Products retrieved');
  } catch (error) {
    next(error);
  }
});

router.get('/:productId', sellerProtect, async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.productId,
      sellerId: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
    }

    return sendSuccess(res, product, 'Product details retrieved');
  } catch (error) {
    next(error);
  }
});

router.put('/:productId', sellerProtect, async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.productId, sellerId: req.seller._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
    }

    return sendSuccess(res, product, 'Product updated');
  } catch (error) {
    next(error);
  }
});

router.delete('/:productId', sellerProtect, async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.productId, sellerId: req.seller._id },
      { isLive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
    }

    return sendSuccess(res, null, 'Product deleted');
  } catch (error) {
    next(error);
  }
});

router.put('/:productId/stock', sellerProtect, async (req, res, next) => {
  try {
    const { stockQuantity } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.productId, sellerId: req.seller._id },
      { stockQuantity, isInStock: stockQuantity > 0 },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
    }

    return sendSuccess(res, product, 'Stock updated');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
