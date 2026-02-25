const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendSuccess, sendSuccessWithPagination } = require('../utils/response');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const paymentService = require('../services/paymentService');
const { notificationsQueue } = require('../config/queue');

router.post('/', protect, async (req, res, next) => {
  try {
    const { paymentMethod, deliveryAddress } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: { code: 'EMPTY_CART', message: 'Cart is empty' } });
    }

    for (const item of cart.items) {
      if (!item.productId.isInStock || item.productId.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          error: { code: 'INSUFFICIENT_STOCK', message: `Insufficient stock for ${item.productId.productName}` } 
        });
      }
    }

    const orderTotal = cart.items.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0);

    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      productNameSnapshot: item.productId.productName,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      unitPrice: item.priceAtAdd,
      productPhotoSnapshot: item.productId.photos[0]?.optimizedUrl,
    }));

    const order = await Order.create({
      buyerId: req.user._id,
      sellerId: cart.items[0].sellerId,
      items: orderItems,
      orderTotal,
      paymentMethod,
      deliveryAddress,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    });

    let razorpayOrder = null;
    if (paymentMethod !== 'cod') {
      razorpayOrder = await paymentService.createOrder(orderTotal, order._id, deliveryAddress);
      order.razorpayOrderId = razorpayOrder.razorpayOrderId;
      await order.save();
    }

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stockQuantity: -item.quantity },
      });
    }

    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    await notificationsQueue.add({
      userId: cart.items[0].sellerId.userId,
      type: 'new-order',
      title: 'New Order Received',
      body: `You have a new order worth ₹${orderTotal}`,
      data: { orderId: order._id },
    });

    return sendSuccess(res, { order, razorpayOrder }, 'Order created successfully');
  } catch (error) {
    next(error);
  }
});

router.post('/payment-verify', protect, async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const isValid = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_SIGNATURE', message: 'Payment verification failed' } });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId },
      { paymentStatus: 'paid', razorpayPaymentId },
      { new: true }
    );

    await notificationsQueue.add({
      userId: req.user._id,
      type: 'order-update',
      title: 'Payment Successful',
      body: 'Your payment has been confirmed',
      data: { orderId: order._id },
    });

    return sendSuccess(res, order, 'Payment verified successfully');
  } catch (error) {
    next(error);
  }
});

router.get('/', protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ buyerId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('sellerId', 'shopName')
      .lean();

    const total = await Order.countDocuments({ buyerId: req.user._id });

    return sendSuccessWithPagination(res, orders, { total, page: parseInt(page), limit: parseInt(limit) }, 'Orders retrieved');
  } catch (error) {
    next(error);
  }
});

router.get('/:orderId', protect, async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      buyerId: req.user._id,
    }).populate('sellerId', 'shopName whatsappNumber');

    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
    }

    return sendSuccess(res, order, 'Order details retrieved');
  } catch (error) {
    next(error);
  }
});

router.post('/:orderId/cancel', protect, async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;

    const order = await Order.findOne({
      _id: req.params.orderId,
      buyerId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
    }

    if (!['placed', 'confirmed'].includes(order.deliveryStatus)) {
      return res.status(400).json({ success: false, error: { code: 'CANNOT_CANCEL', message: 'Order cannot be cancelled' } });
    }

    order.deliveryStatus = 'cancelled';
    order.cancellationReason = cancellationReason;
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: item.quantity },
      });
    }

    return sendSuccess(res, order, 'Order cancelled successfully');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
