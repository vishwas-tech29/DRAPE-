const { outfitDetectionQueue } = require('../config/queue');
const aiService = require('../services/aiService');
const AIScanJob = require('../models/AIScanJob');
const Product = require('../models/Product');
const logger = require('../config/logger');

outfitDetectionQueue.process(async (job) => {
  const { scanJobId, imageUrl } = job.data;

  try {
    logger.info(`Processing outfit detection job: ${scanJobId}`);

    await AIScanJob.findByIdAndUpdate(scanJobId, { status: 'processing' });

    const aiResult = await aiService.detectOutfit(imageUrl);

    const tags = aiResult.tags || [];
    let matchedProducts = [];

    if (tags.length > 0) {
      matchedProducts = await Product.find({
        $text: { $search: tags.join(' ') },
        isLive: true,
      })
        .limit(50)
        .populate('sellerId', 'shopName city')
        .lean();

      matchedProducts = matchedProducts.map(product => {
        const matchCount = tags.filter(tag => 
          product.tags?.some(pTag => pTag.toLowerCase().includes(tag.toLowerCase()))
        ).length;
        return { ...product, matchScore: matchCount };
      }).sort((a, b) => b.matchScore - a.matchScore);
    }

    await AIScanJob.findByIdAndUpdate(scanJobId, {
      status: 'completed',
      detectedItems: aiResult.detectedItems || [],
      suggestedTags: tags,
      result: {
        matchedProducts: matchedProducts.slice(0, 20).map(p => p._id),
        totalMatches: matchedProducts.length,
      },
    });

    logger.info(`Outfit detection completed: ${scanJobId}`);
  } catch (error) {
    logger.error(`Outfit detection failed: ${error.message}`);
    await AIScanJob.findByIdAndUpdate(scanJobId, { status: 'failed' });
    throw error;
  }
});

logger.info('Outfit detection worker started');
