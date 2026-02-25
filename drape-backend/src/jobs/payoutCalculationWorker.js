const { payoutCalculationQueue } = require('../config/queue');
const Order = require('../models/Order');
const Seller = require('../models/Seller');
const commissionService = require('../services/commissionService');
const { notificationsQueue } = require('../config/queue');
const logger = require('../config/logger');

payoutCalculationQueue.process(async (job) => {
  const { orderId } = job.data;

  try {
    logger.info(`Processing payout calculation for order: ${orderId}`);

    const order = await Order.findById(orderId).populate('sellerId');

    if (!order) {
      throw new Error('Order not found');
    }

    const seller = order.sellerId;
    const orderAmount = order.orderTotal;

    const { commissionRate, commissionAmount, netSellerAmount } = 
      commissionService.calculateCommission(seller, orderAmount);

    await Order.findByIdAndUpdate(orderId, {
      commissionAmount,
      commissionRate,
      netSellerPayout: netSellerAmount,
    });

    const previousTotal = seller.totalSalesAmount;
    seller.totalSalesAmount += orderAmount;
    await seller.save();

    const { crossedThreshold, threshold } = commissionService.checkTractionThreshold({
      ...seller.toObject(),
      totalSalesAmount: previousTotal,
    });

    if (crossedThreshold) {
      await notificationsQueue.add({
        userId: seller.userId,
        type: 'system',
        title: 'Commission Structure Update',
        body: `Congratulations! You've crossed ₹${threshold} in sales. Future orders will have an 8% commission.`,
        data: { threshold, newRate: 8 },
      });
    }

    logger.info(`Payout calculation completed for order: ${orderId}`);
  } catch (error) {
    logger.error(`Payout calculation failed: ${error.message}`);
    throw error;
  }
});

logger.info('Payout calculation worker started');
