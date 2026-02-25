const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendSuccess } = require('../utils/response');
const SavedBoard = require('../models/SavedBoard');

router.get('/', protect, async (req, res, next) => {
  try {
    const boards = await SavedBoard.find({ userId: req.user._id }).lean();
    return sendSuccess(res, boards, 'Boards retrieved');
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const { boardName } = req.body;
    const board = await SavedBoard.create({
      userId: req.user._id,
      boardName,
    });
    return sendSuccess(res, board, 'Board created');
  } catch (error) {
    next(error);
  }
});

router.get('/:boardId', protect, async (req, res, next) => {
  try {
    const board = await SavedBoard.findOne({
      _id: req.params.boardId,
      userId: req.user._id,
    }).populate('products');

    if (!board) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Board not found' } });
    }

    return sendSuccess(res, board, 'Board details retrieved');
  } catch (error) {
    next(error);
  }
});

router.post('/:boardId/products', protect, async (req, res, next) => {
  try {
    const { productId } = req.body;

    const board = await SavedBoard.findOneAndUpdate(
      { _id: req.params.boardId, userId: req.user._id },
      { $addToSet: { products: productId } },
      { new: true }
    );

    if (!board) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Board not found' } });
    }

    return sendSuccess(res, board, 'Product saved to board');
  } catch (error) {
    next(error);
  }
});

router.delete('/:boardId/products/:productId', protect, async (req, res, next) => {
  try {
    const board = await SavedBoard.findOneAndUpdate(
      { _id: req.params.boardId, userId: req.user._id },
      { $pull: { products: req.params.productId } },
      { new: true }
    );

    if (!board) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Board not found' } });
    }

    return sendSuccess(res, board, 'Product removed from board');
  } catch (error) {
    next(error);
  }
});

router.put('/:boardId', protect, async (req, res, next) => {
  try {
    const { boardName, isPublic } = req.body;

    const board = await SavedBoard.findOneAndUpdate(
      { _id: req.params.boardId, userId: req.user._id },
      { boardName, isPublic },
      { new: true }
    );

    if (!board) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Board not found' } });
    }

    return sendSuccess(res, board, 'Board updated');
  } catch (error) {
    next(error);
  }
});

router.delete('/:boardId', protect, async (req, res, next) => {
  try {
    const board = await SavedBoard.findOneAndDelete({
      _id: req.params.boardId,
      userId: req.user._id,
    });

    if (!board) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Board not found' } });
    }

    return sendSuccess(res, null, 'Board deleted');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
