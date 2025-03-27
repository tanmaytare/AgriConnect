const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Crop, Seed, Fertilizer
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String }, // Image URL for product
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // Seller's ID
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
