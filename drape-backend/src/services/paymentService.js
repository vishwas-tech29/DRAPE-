const Razorpay = require('razorpay');
const crypto = require('crypto');
const logger = require('../config/logger');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (amount, orderId, buyerDetails) => {
  try {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: orderId.toString(),
      notes: {
        buyerName: buyerDetails.fullName,
        buyerPhone: buyerDetails.phone,
      },
    };

    const order = await razorpay.orders.create(options);

    return {
      razorpayOrderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    logger.error(`Razorpay order creation failed: ${error.message}`);
    throw new Error('Payment order creation failed');
  }
};

exports.verifyPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  try {
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    return generated_signature === razorpaySignature;
  } catch (error) {
    logger.error(`Payment verification failed: ${error.message}`);
    return false;
  }
};

exports.initiatePayout = async (upiId, amount, referenceId) => {
  try {
    const payout = await razorpay.payouts.create({
      account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
      amount: amount * 100,
      currency: 'INR',
      mode: 'UPI',
      purpose: 'payout',
      fund_account: {
        account_type: 'vpa',
        vpa: {
          address: upiId,
        },
      },
      queue_if_low_balance: true,
      reference_id: referenceId,
    });

    return {
      payoutId: payout.id,
      status: payout.status,
    };
  } catch (error) {
    logger.error(`Razorpay payout failed: ${error.message}`);
    throw new Error('Payout initiation failed');
  }
};

exports.verifyWebhook = (webhookBody, webhookSignature) => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(webhookBody))
      .digest('hex');

    return expectedSignature === webhookSignature;
  } catch (error) {
    logger.error(`Webhook verification failed: ${error.message}`);
    return false;
  }
};
