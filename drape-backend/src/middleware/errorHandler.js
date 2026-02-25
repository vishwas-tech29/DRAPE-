const logger = require('../config/logger');
const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    userId: req.user?._id,
  });

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
    return sendError(res, 400, 'VALIDATION_ERROR', 'Validation failed', details);
  }

  if (err.name === 'CastError') {
    return sendError(res, 400, 'INVALID_ID', 'Invalid ID format');
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return sendError(res, 400, 'DUPLICATE_ENTRY', `${field} already exists`);
  }

  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'INVALID_TOKEN', 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'TOKEN_EXPIRED', 'Token expired');
  }

  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  return sendError(res, err.statusCode || 500, 'SERVER_ERROR', message);
};

module.exports = errorHandler;
