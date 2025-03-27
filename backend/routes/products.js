const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/User');

// List a Product
router.post('/list', authenticateToken, async (req, res) => {
  try {
    const { name, category, price, quantity, description, image } = req.body;
    const product = new Product({
      name,
      category,
      price,
      quantity,
      description,
      image,
      ownerId: req.user.userId
    });

    await product.save();
    res.status(201).json({ message: 'Product listed successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// View all products
router.get('/all', async (req, res) => {
  try {
    console.log("Fetching all products...");
    const products = await Product.find().populate('ownerId', 'name email');
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


// View user's own products
router.get('/my-products', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find({ ownerId: req.user.userId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Edit a product
router.put('/edit/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a product
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, ownerId: req.user.userId });

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
