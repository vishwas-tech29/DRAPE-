const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendSuccess } = require('../utils/response');

router.get('/me', protect, async (req, res, next) => {
  try {
    return sendSuccess(res, req.user, 'User profile retrieved');
  } catch (error) {
    next(error);
  }
});

router.put('/me', protect, async (req, res, next) => {
  try {
    const { fullName, email, profilePhoto, bodyType } = req.body;
    const User = require('../models/User');
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, email, profilePhoto, 'stylePreferences.bodyType': bodyType },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
});

router.put('/me/style-preferences', protect, async (req, res, next) => {
  try {
    const { preferredCategories, styleVibe, genderPreference, bodyType } = req.body;
    const User = require('../models/User');
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        stylePreferences: { preferredCategories, styleVibe, genderPreference, bodyType },
        onboardingCompleted: true,
      },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, user, 'Style preferences updated');
  } catch (error) {
    next(error);
  }
});

router.put('/me/device-token', protect, async (req, res, next) => {
  try {
    const { deviceToken } = req.body;
    const User = require('../models/User');
    
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { deviceTokens: deviceToken },
    });

    return sendSuccess(res, null, 'Device token registered');
  } catch (error) {
    next(error);
  }
});

router.get('/me/cashback', protect, async (req, res, next) => {
  try {
    const data = {
      totalEarned: req.user.totalCashbackEarned,
      available: req.user.cashbackAvailable,
      transactions: [],
    };

    return sendSuccess(res, data, 'Cashback details retrieved');
  } catch (error) {
    next(error);
  }
});

router.post('/me/refer', protect, async (req, res, next) => {
  try {
    const referralLink = `${process.env.APP_BASE_URL}/refer/${req.user.referralCode}`;
    
    return sendSuccess(res, { referralCode: req.user.referralCode, referralLink }, 'Referral link generated');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
