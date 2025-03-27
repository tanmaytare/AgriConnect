// models/Rental.js
const mongoose = require("mongoose");

const RentalSchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment", required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who booked
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Ongoing", "Completed"], default: "Pending" },
});

module.exports = mongoose.model("Rental", RentalSchema);
