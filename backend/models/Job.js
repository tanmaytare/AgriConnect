const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  wage: { type: Number, required: true }, // Payment per day/hour
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who posted the job
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Worker" }], // Applied workers
  status: { type: String, enum: ["open", "closed"], default: "open" }, // Job status
});

module.exports = mongoose.model("Job", JobSchema);
