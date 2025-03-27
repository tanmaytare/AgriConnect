const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link to User
  skills: [{ type: String, required: true }], // Example: ["Plowing", "Harvesting"]
  experience: { type: Number, required: true }, // In years
  location: { type: String, required: true },
  availability: { type: Boolean, default: true }, // If they are looking for work
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }], // Track applied jobs
});

module.exports = mongoose.model("Worker", WorkerSchema);
