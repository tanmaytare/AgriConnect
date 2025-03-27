// routes/rentalRoutes.js
const express = require("express");
const Rental = require("../models/Rental");
const Equipment = require("../models/Equipment");
const router = express.Router();
const authMiddleware = require("../middleware/authenticateToken");

// Rent equipment
router.post("/rent", authMiddleware, async (req, res) => {
  try {
    const { equipmentId, startDate, endDate } = req.body;
    const equipment = await Equipment.findById(equipmentId);

    if (!equipment || !equipment.available) {
      return res.status(400).json({ success: false, message: "Equipment not available" });
    }

    const rental = new Rental({
      equipment: equipmentId,
      renter: req.user.id,
      startDate,
      endDate,
      status: "Pending",
    });

    await rental.save();
    res.status(201).json({ success: true, message: "Equipment rented successfully", rental });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get all rentals of a user
router.get("/my-rentals", authMiddleware, async (req, res) => {
  try {
    const rentals = await Rental.find({ renter: req.user.id }).populate("equipment");
    res.status(200).json({ success: true, rentals });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
