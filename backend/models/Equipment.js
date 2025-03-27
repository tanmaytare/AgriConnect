const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: String,
  category: String,
  rentalPrice: Number,
  image: String,
  status: { type: String, enum: ['Available', 'Rented', 'Under Maintenance'], default: 'Available' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rentalHistory: [
    {
      renterName: String,
      duration: Number,
      price: Number,
      rentedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
