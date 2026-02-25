const admin = require('firebase-admin');
const logger = require('../config/logger');
const Notification = require('../models/Notification');

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
} catch (error) {
  logger.warn('Firebase initialization skipped - credentials not configured');
}

exports.sendPushNotification = async (deviceTokens, title, body, data = {}) => {
  try {
    if (!deviceTokens || deviceTokens.length === 0) {
      return { success: false, message: 'No device tokens provided' };
    }

    const message = {
      notification: {
        title,
        body,
      },
      data,
      tokens: deviceTokens,
    };

    const response = await admin.messaging().sendMulticast(message);

    logger.info(`Push notification sent: ${response.successCount} successful, ${response.failureCount} failed`);

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokens: response.responses
        .map((r, idx) => (r.success ? null : deviceTokens[idx]))
        .filter(Boolean),
    };
  } catch (error) {
    logger.error(`Push notification failed: ${error.message}`);
    return { success: false, message: error.message };
  }
};

exports.createNotification = async (userId, type, title, body, data = {}) => {
  try {
    const notification = await Notification.create({
      recipientUserId: userId,
      type,
      title,
      body,
      data,
    });

    return notification;
  } catch (error) {
    logger.error(`Notification creation failed: ${error.message}`);
    throw error;
  }
};
