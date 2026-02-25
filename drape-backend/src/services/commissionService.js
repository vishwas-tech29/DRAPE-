const logger = require('../config/logger');

exports.calculateCommission = (seller, orderAmount) => {
  try {
    let commissionRate = 0;

    if (seller.foundingSeller) {
      commissionRate = 5;
    } else if (seller.totalSalesAmount < parseFloat(process.env.TRACTION_THRESHOLD || 50000)) {
      commissionRate = 0;
    } else {
      commissionRate = 8;
    }

    const commissionAmount = (orderAmount * commissionRate) / 100;
    const netSellerAmount = orderAmount - commissionAmount;

    return {
      commissionRate,
      commissionAmount: Math.round(commissionAmount * 100) / 100,
      netSellerAmount: Math.round(netSellerAmount * 100) / 100,
    };
  } catch (error) {
    logger.error(`Commission calculation failed: ${error.message}`);
    throw error;
  }
};

exports.checkTractionThreshold = (seller) => {
  const threshold = parseFloat(process.env.TRACTION_THRESHOLD || 50000);
  const previousTotal = seller.totalSalesAmount;
  
  return {
    crossedThreshold: previousTotal < threshold && seller.totalSalesAmount >= threshold,
    threshold,
  };
};
