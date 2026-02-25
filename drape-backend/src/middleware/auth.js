const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Seller = require('../models/Seller');
const { sendError } = require('../utils/response');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'AUTH_REQUIRED', 'Authentication required');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');

      if (!req.user) {
        return sendError(res, 401, 'USER_NOT_FOUND', 'User not found');
      }

      if (req.user.accountStatus !== 'active') {
        return sendError(res, 403, 'ACCOUNT_INACTIVE', 'Account is not active');
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return sendError(res, 401, 'TOKEN_EXPIRED', 'Token expired, please refresh');
      }
      return sendError(res, 401, 'INVALID_TOKEN', 'Invalid token');
    }
  } catch (error) {
    return sendError(res, 500, 'SERVER_ERROR', 'Authentication error');
  }
};

exports.sellerProtect = async (req, res, next) => {
  try {
    await exports.protect(req, res, async () => {
      const seller = await Seller.findOne({ userId: req.user._id, accountStatus: 'active' });

      if (!seller) {
        return sendError(res, 403, 'SELLER_ACCESS_REQUIRED', 'Seller account required');
      }

      if (!seller.isActive) {
        return sendError(res, 403, 'SELLER_INACTIVE', 'Seller account is inactive');
      }

      req.seller = seller;
      next();
    });
  } catch (error) {
    return sendError(res, 500, 'SERVER_ERROR', 'Seller authentication error');
  }
};
