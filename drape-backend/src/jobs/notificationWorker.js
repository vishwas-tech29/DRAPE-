const { notificationsQueue } = require('../config/queue');
const User = require('../models/User');
const notificationService = require('../services/notificationService');
const logger = require('../config/logger');

notificationsQueue.process(async (job) => {
  const { userId, type, title, body, data } = job.data;

  try {
    logger.info(`Processing notification for user: ${userId}`);

    await notificationService.createNotification(userId, type, title, body, data);

    const user = await User.findById(userId);

    if (user && user.deviceTokens && user.deviceTokens.length > 0) {
      const result = await notificationService.sendPushNotification(
        user.deviceTokens,
        title,
        body,
        data
      );

      if (result.invalidTokens && result.invalidTokens.length > 0) {
        await User.findByIdAndUpdate(userId, {
          $pull: { deviceTokens: { $in: result.invalidTokens } },
        });
      }
    }

    logger.info(`Notification sent to user: ${userId}`);
  } catch (error) {
    logger.error(`Notification sending failed: ${error.message}`);
    throw error;
  }
});

logger.info('Notification worker started');
