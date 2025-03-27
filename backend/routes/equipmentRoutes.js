// routes/equipmentRoutes.js
const express = require("express");
const Equipment = require("../models/Equipment");
const router = express.Router();
const authMiddleware = require("../middleware/authenticateToken");

// Add new equipment
router.post("/add", authMiddleware, async (req, res) => {   
  try {
    const { name, description, image, rentalPrice, location } = req.body;
    const equipment = new Equipment({
      name,
      description,
      image,
      rentalPrice,
      location,
      owner: req.user.id, // Get owner from logged-in user
    });
    await equipment.save();
    res.status(201).json({ success: true, message: "Equipment added", equipment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get all available equipment
router.get("/available", async (req, res) => {
  try {
    const equipment = await Equipment.find({ available: true });
    res.status(200).json({ success: true, equipment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get equipment by ID
router.get("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ message: "Equipment not found" });
    res.status(200).json({ success: true, equipment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 🟢 Get equipment listed by logged-in farmer
router.get('/my-equipments', authMiddleware, async (req, res) => {
    try {
      const equipments = await Equipment.find({ owner: req.user.id });
      res.json(equipments);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch equipment' });
    }
  });
  
  // 🔴 Delete equipment by ID
  router.delete('/equipment/:id', authMiddleware, async (req, res) => {
    try {
      await Equipment.findByIdAndDelete(req.params.id);
      res.json({ message: 'Equipment deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete equipment' });
    }
  });

module.exports = router;
