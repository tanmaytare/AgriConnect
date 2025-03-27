const express = require('express');
const Order = require('../models/Order');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// Create an order
router.post('/place-order', authenticateToken, async (req, res) => {
    try {
        const { products, shippingAddress, totalAmount } = req.body;

        // Validate that productId exists for each product
        if (!products || !products.length || products.some(p => !p.productId)) {
            return res.status(400).json({ message: "Each product must have a valid productId" });
        }

        const order = new Order({
            userId: req.user.userId,
            products,
            totalAmount,
            shippingAddress,
            status: "Paid",
            paymentStatus: "Completed"
        });

        await order.save();
        res.json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


// Get user orders
router.get('/my-orders', authenticateToken, async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.user.userId }).populate('products.productId');
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error); // Log error for debugging
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });
  

module.exports = router;
