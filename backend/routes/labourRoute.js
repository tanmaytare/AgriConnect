const express = require('express');
const Job = require('../models/Job');
const Worker = require('../models/Worker');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post("/jobs", authenticateToken, async (req, res) => {
    try {
      const { title, description, location, wage } = req.body;
      if (!title || !description || !location || !wage) {
        return res.status(400).json({ message: "All fields are required" });
    }
      const newJob = new Job({
        title,
        description,
        location,
        wage,
        farmerId: req.user.userId, // From JWT token
      });
      await newJob.save();
      res.status(201).json({ message: "Job posted successfully", job: newJob });
    } catch (error) {
      console.error("Job posting error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

// New route to get all jobs
router.get("/jobs", async (req, res) => {
    try {
      const jobs = await Job.find(); // Fetch all jobs from the database
      res.status(200).json(jobs); // Send the jobs as a response
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
// Add a new route to register workers
router.post("/workers/register", authenticateToken, async (req, res) => {
    try {
      const { skills, experience, location } = req.body;
      const existingWorker = await Worker.findOne({ userId: req.user.userId });
      
      if (existingWorker) {
        return res.status(400).json({ message: "You are already registered as a worker" });
      }
  
      const newWorker = new Worker({
        userId: req.user.userId, // Link to User model
        skills,
        experience,
        location,
      });
      await newWorker.save();
      res.status(201).json({ message: "Worker registered successfully", worker: newWorker });
    } catch (error) {
      console.error("Worker registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  
  router.post("/jobs/apply/:jobId", authenticateToken, async (req, res) => {
    try {
      const worker = await Worker.findOne({ userId: req.user.userId });
      if (!worker) {
        return res.status(403).json({ message: "You are not registered as a worker" });
      }
  
      const job = await Job.findById(req.params.jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      // Prevent applying more than once
      if (worker.appliedJobs.includes(job._id)) {
        return res.status(400).json({ message: "You have already applied for this job" });
      }
  
      job.applications.push(worker._id);
      await job.save();
  
      worker.appliedJobs.push(job._id);
      await worker.save();
  
      res.json({ message: "Job application successful" });
    } catch (error) {
      console.error("Job application error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Check if the logged-in user is already registered as a worker
router.get("/workers/status", authenticateToken, async (req, res) => {
    try {
      const worker = await Worker.findOne({ userId: req.user.userId });
      if (worker) {
        res.status(200).json({ isWorker: true, worker });
      } else {
        res.status(200).json({ isWorker: false });
      }
    } catch (error) {
      console.error("Error checking worker status:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get all jobs posted by the logged-in farmer
router.get("/jobs/my-jobs", authenticateToken, async (req, res) => {
    try {
      const jobs = await Job.find({ farmerId: req.user.userId }); // Fetch jobs posted by the logged-in farmer
      res.status(200).json(jobs); // Return the jobs as a response
    } catch (error) {
      console.error("Error fetching farmer's jobs:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  
  // Get all jobs applied by the logged-in worker
router.get("/jobs/my-applications", authenticateToken, async (req, res) => {
    try {
      const worker = await Worker.findOne({ userId: req.user.userId }); // Find the worker based on logged-in user
      if (!worker) {
        return res.status(404).json({ message: "Worker not found" });
      }
      const appliedJobs = await Job.find({ _id: { $in: worker.appliedJobs } }); // Fetch all jobs where the worker has applied
      res.status(200).json(appliedJobs); // Return the applied jobs as a response
    } catch (error) {
      console.error("Error fetching worker's applications:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  module.exports = router;