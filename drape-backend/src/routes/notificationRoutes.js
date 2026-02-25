const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendSuccessWithPagination, sendSuccess } = require('../utils/response');
const Notification = require('../models/Notification');

router.get('/', protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipientUserId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Notification.countDocuments({ recipientUserId: req.user._id });

    return sendSuccessWithPagination(res, notifications, { total, page: parseInt(page), limit: parseInt(limit) }, 'Notifications retrieved');
  } catch (error) {
    next(error);
  }
});

router.put('/:notificationId/read', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, recipientUserId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found' } });
    }

    return sendSuccess(res, notification, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
});

router.put('/read-all', protect, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipientUserId: req.user._id, isRead: false },
      { isRead: true }
    );

    return sendSuccess(res, null, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
});

router.delete('/:notificationId', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.notificationId,
      recipientUserId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found' } });
    }

    return sendSuccess(res, null, 'Notification deleted');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
