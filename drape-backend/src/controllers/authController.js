const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const redis = require('../config/redis');
const smsService = require('../services/smsService');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../config/logger');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '15m',
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '30d',
  });

  return { accessToken, refreshToken };
};

exports.sendOTP = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
      return sendError(res, 400, 'INVALID_PHONE', 'Invalid phone number');
    }

    const rateLimitKey = `otp:ratelimit:${phoneNumber}`;
    const attempts = await redis.get(rateLimitKey);

    if (attempts && parseInt(attempts) >= 3) {
      return sendError(res, 429, 'RATE_LIMIT', 'Too many OTP requests. Try again in 1 hour');
    }

    const otp = generateOTP();
    const otpKey = `otp:${phoneNumber}`;

    await redis.setex(otpKey, 600, otp);
    await redis.incr(rateLimitKey);
    await redis.expire(rateLimitKey, 3600);

    const smsSent = await smsService.sendOTP(phoneNumber, otp);

    if (!smsSent) {
      logger.warn(`SMS failed for ${phoneNumber}, OTP: ${otp}`);
    }

    logger.info(`OTP generated for ${phoneNumber}: ${otp}`);

    return sendSuccess(res, { phoneNumber }, 'OTP sent successfully');
  } catch (error) {
    next(error);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { phoneNumber, otp, fullName, city } = req.body;

    if (!phoneNumber || !otp) {
      return sendError(res, 400, 'MISSING_FIELDS', 'Phone number and OTP required');
    }

    const otpKey = `otp:${phoneNumber}`;
    const storedOTP = await redis.get(otpKey);

    if (!storedOTP) {
      return sendError(res, 400, 'OTP_EXPIRED', 'OTP expired or invalid');
    }

    if (storedOTP !== otp) {
      return sendError(res, 400, 'INVALID_OTP', 'Invalid OTP');
    }

    await redis.del(otpKey);

    let user = await User.findOne({ phoneNumber });
    let isNewUser = false;

    if (!user) {
      if (!fullName || !city) {
        return sendError(res, 400, 'MISSING_FIELDS', 'Full name and city required for new users');
      }

      user = await User.create({
        fullName,
        phoneNumber,
        city,
      });

      isNewUser = true;
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    return sendSuccess(res, {
      user: {
        id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        city: user.city,
        onboardingCompleted: user.onboardingCompleted,
      },
      accessToken,
      refreshToken,
      isNewUser,
    }, 'Authentication successful');
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendError(res, 400, 'TOKEN_REQUIRED', 'Refresh token required');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshToken) {
      return sendError(res, 401, 'INVALID_TOKEN', 'Invalid refresh token');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isValid) {
      return sendError(res, 401, 'INVALID_TOKEN', 'Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    return sendSuccess(res, {
      accessToken,
      refreshToken: newRefreshToken,
    }, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.refreshToken = null;
    await user.save();

    return sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};
