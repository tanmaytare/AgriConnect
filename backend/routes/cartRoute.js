const express = require('express');
const Cart = require('../models/Cart');

const router = express.Router();

// Add item to cart
router.post('/add', async (req, res) => {
    try {
      const { userId, productId, name, price, quantity } = req.body;
  
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
  
      let existingItem = cart.items.find(item => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, name, price, quantity });
      }
  
      await cart.save();
      res.json(cart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
// Get user cart
router.get('/:userId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
  res.json(cart || { items: [] });
});

router.put('/cart/update', (req, res) => {
    const { productId, quantity } = req.body;
    
    let cart = req.session.cart || [];
    cart = cart.map(item => item.productId === productId ? { ...item, quantity } : item);
  
    req.session.cart = cart;
    res.json({ items: cart });
  });

  
// Remove item from cart
router.delete('/remove/:userId/:productId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
  await cart.save();
  res.json(cart);
});

// Clear the cart
router.delete('/clear/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      await Cart.deleteMany({ userId });
      res.json({ message: "Cart cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });

module.exports = router;
