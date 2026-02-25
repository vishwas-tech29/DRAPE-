const express = require('express');
const router = express.Router();
const { protect, sellerProtect } = require('../middleware/auth');
const { sendSuccess } = require('../utils/response');
const Seller = require('../models/Seller');

router.post('/register', protect, async (req, res, next) => {
  try {
    const existingSeller = await Seller.findOne({ userId: req.user._id });

    if (existingSeller) {
      return res.status(400).json({ success: false, error: { code: 'ALREADY_SELLER', message: 'User is already a seller' } });
    }

    const cutoffDate = new Date(process.env.FOUNDING_SELLER_CUTOFF_DATE || '2024-08-01');
    const isFoundingSeller = new Date() < cutoffDate;

    const seller = await Seller.create({
      userId: req.user._id,
      ...req.body,
      foundingSeller: isFoundingSeller,
    });

    return sendSuccess(res, seller, 'Seller registered successfully', 201);
  } catch (error) {
    next(error);
  }
});

router.get('/me', sellerProtect, async (req, res, next) => {
  try {
    return sendSuccess(res, req.seller, 'Seller profile retrieved');
  } catch (error) {
    next(error);
  }
});

router.put('/me', sellerProtect, async (req, res, next) => {
  try {
    const { shopName, shopDescription, shopLogo, deliveryAreas, estimatedDeliveryDays, upiId, bankAccountDetails } = req.body;

    const seller = await Seller.findByIdAndUpdate(
      req.seller._id,
      { shopName, shopDescription, shopLogo, deliveryAreas, estimatedDeliveryDays, upiId, bankAccountDetails },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, seller, 'Seller profile updated');
  } catch (error) {
    next(error);
  }
});

router.put('/me/holiday', sellerProtect, async (req, res, next) => {
  try {
    const { isOnHoliday, holidayReturnDate } = req.body;

    const seller = await Seller.findByIdAndUpdate(
      req.seller._id,
      { isOnHoliday, holidayReturnDate },
      { new: true }
    );

    return sendSuccess(res, seller, 'Holiday mode updated');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
