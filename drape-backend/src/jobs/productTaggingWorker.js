const { productTaggingQueue } = require('../config/queue');
const aiService = require('../services/aiService');
const Product = require('../models/Product');
const logger = require('../config/logger');

productTaggingQueue.process(async (job) => {
  const { productId, imageUrl } = job.data;

  try {
    logger.info(`Processing product tagging job: ${productId}`);

    const aiResult = await aiService.generateProductTags(imageUrl);

    if (aiResult) {
      const updateData = {
        isLive: true,
      };

      if (aiResult.tags) {
        updateData.tags = aiResult.tags;
      }

      if (aiResult.styleAttributes) {
        updateData.styleAttributes = aiResult.styleAttributes;
      }

      if (aiResult.subcategory) {
        updateData.subcategory = aiResult.subcategory;
      }

      await Product.findByIdAndUpdate(productId, updateData);

      logger.info(`Product tagging completed: ${productId}`);
    } else {
      await Product.findByIdAndUpdate(productId, { isLive: true });
      logger.warn(`Product tagging returned no results, product set to live: ${productId}`);
    }
  } catch (error) {
    logger.error(`Product tagging failed: ${error.message}`);
    await Product.findByIdAndUpdate(productId, { isLive: true });
    throw error;
  }
});

logger.info('Product tagging worker started');
