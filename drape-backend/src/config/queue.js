const Queue = require('bull');
const redis = require('./redis');

const createQueue = (name) => {
  return new Queue(name, {
    redis: {
      host: process.env.REDIS_URL?.split(':')[1]?.replace('//', '') || 'localhost',
      port: process.env.REDIS_URL?.split(':')[2] || 6379,
    },
  });
};

const outfitDetectionQueue = createQueue('outfit-detection');
const productTaggingQueue = createQueue('product-tagging');
const designGenerationQueue = createQueue('design-generation');
const tryonQueue = createQueue('tryon');
const payoutCalculationQueue = createQueue('payout-calculation');
const notificationsQueue = createQueue('notifications');
const searchAnalyticsQueue = createQueue('search-analytics');

module.exports = {
  outfitDetectionQueue,
  productTaggingQueue,
  designGenerationQueue,
  tryonQueue,
  payoutCalculationQueue,
  notificationsQueue,
  searchAnalyticsQueue,
};
