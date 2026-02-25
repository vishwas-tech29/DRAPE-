const express = require('express');
const router = express.Router();
const { sellerProtect } = require('../middleware/auth');
const { sendSuccessWithPagination, sendSuccess } = require('../utils/response');
const Order = require('../models/Order');
const { notificationsQueue, payoutCalculationQueue } = require('../config/queue');

router.get('/', sellerProtect, async (req, res, next) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { sellerId: req.seller._id };
    if (status !== 'all') {
      filter.deliveryStatus = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('buyerId', 'fullName phoneNumber')
      .lean();

    const total = await Order.countDocuments(filter);

    return sendSuccessWithPagination(res, orders, { total, page: parseInt(page), limit: parseInt(limit) }, 'Orders retrieved');
  } catch (error) {
    next(error);
  }
});

router.get('/:orderId', sellerProtect, async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      sellerId: req.seller._id,
    }).populate('buyerId', 'fullName phoneNumber');

    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
    }

    return sendSuccess(res, order, 'Order details retrieved');
  } catch (error) {
    next(error);
  }
});

router.put('/:orderId/confirm', sellerProtect, async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, sellerId: req.seller._id },
      { deliveryStatus: 'confirmed' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
    }

    await notificationsQueue.add({
      userId: order.buyerId,
      type: 'order-update',
      title: 'Order Confirmed',
      body: 'Your order has been confirmed by the seller',
      data: { orderId: order._id },
    });

    return sendSuccess(res, order, 'Order confirmed');
  } catch (error) {
    next(error);
  }
});

router.put('/:orderId/ship', sellerProtect, async (req, res, next) => {
  try {
    const { trackingNumber } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, sellerId: req.seller._id },
      { 
        deliveryStatus: 'shipped',
        trackingNumber,
        estimatedDeliveryDate: new Date(Date.now() + req.seller.estimatedDeliveryDays * 24 * 60 * 60 * 1000),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
    }

    await notificationsQueue.add({
      userId: order.buyerId,
      type: 'order-update',
      title: 'Order Shipped',
      body: 'Your order has been shipped',
      data: { orderId: order._id, trackingNumber },
    });

    return sendSuccess(res, order, 'Order marked as shipped');
  } catch (error) {
    next(error);
  }
});

router.put('/:orderId/deliver', sellerProtect, async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, sellerId: req.seller._id },
      { 
        deliveryStatus: 'delivered',
        actualDeliveryDate: new Date(),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
    }

    await payoutCalculationQueue.add({ orderId: order._id });

    await notificationsQueue.add({
      userId: order.buyerId,
      type: 'order-update',
      title: 'Order Delivered',
      body: 'Your order has been delivered',
      data: { orderId: order._id },
    });

    return sendSuccess(res, order, 'Order marked as delivered');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
