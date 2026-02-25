const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendSuccess } = require('../utils/response');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

router.get('/', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId')
      .populate('items.sellerId', 'shopName');

    return sendSuccess(res, cart || { items: [] }, 'Cart retrieved');
  } catch (error) {
    next(error);
  }
});

router.post('/items', protect, async (req, res, next) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body;

    const product = await Product.findById(productId).populate('sellerId');

    if (!product || !product.isLive || !product.isInStock) {
      return res.status(400).json({ success: false, error: { code: 'PRODUCT_UNAVAILABLE', message: 'Product not available' } });
    }

    if (!product.sellerId.isActive) {
      return res.status(400).json({ success: false, error: { code: 'SELLER_INACTIVE', message: 'Seller is inactive' } });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      item => item.productId.toString() === productId && item.selectedSize === size && item.selectedColor === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        sellerId: product.sellerId._id,
        selectedColor: color,
        selectedSize: size,
        quantity,
        priceAtAdd: product.price,
      });
    }

    await cart.save();
    await cart.populate('items.productId');

    return sendSuccess(res, cart, 'Item added to cart');
  } catch (error) {
    next(error);
  }
});

router.put('/items/:itemId', protect, async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, error: { code: 'CART_NOT_FOUND', message: 'Cart not found' } });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'ITEM_NOT_FOUND', message: 'Item not found' } });
    }

    item.quantity = quantity;
    await cart.save();

    return sendSuccess(res, cart, 'Cart updated');
  } catch (error) {
    next(error);
  }
});

router.delete('/items/:itemId', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, error: { code: 'CART_NOT_FOUND', message: 'Cart not found' } });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();

    return sendSuccess(res, cart, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
});

router.delete('/', protect, async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [] }
    );

    return sendSuccess(res, null, 'Cart cleared');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
