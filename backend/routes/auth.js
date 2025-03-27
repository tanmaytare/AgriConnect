// router.js
const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const User = require('../models/User');
const router = express.Router();

// OTP Storage (Temporary)
const otpStore = {};

// Rate Limiting (Prevent Brute Force Attacks)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 requests per window
  message: { message: "Too many login attempts. Try again later." }
});

// Transporter for email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS }
});

// Generate JWT & Refresh Token
const generateTokens = (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return { token, refreshToken };
};

// Middleware to Verify Access Token
// const authenticateToken = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: "Access Denied" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Invalid Token" });
//     req.user = user;
//     next();
//   });
// };

// Refresh Token Endpoint
const refreshTokens = {};
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshTokens[refreshToken]) return res.status(403).json({ message: "Forbidden" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Refresh Token" });
    const tokens = generateTokens(user);
    refreshTokens[tokens.refreshToken] = true;
    res.json(tokens);
  });
});

// User Signup (With OTP Verification)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { name, email, hashedPassword, otp };

    await transporter.sendMail({ from: process.env.EMAIL, to: email, subject: "Verify Email", text: `Your OTP: ${otp}` });

    res.json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// OTP Verification
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedData = otpStore[email];

    if (!storedData || storedData.otp !== otp) 
      return res.status(400).json({ message: "Invalid OTP" });

    const user = new User({ 
      name: storedData.name,  // ✅ Now saving name
      email: storedData.email, 
      password: storedData.hashedPassword 
    });

    await user.save();
    delete otpStore[email];

    const tokens = generateTokens(user);
    refreshTokens[tokens.refreshToken] = true;
    
    res.json({ message: "OTP Verified", user, ...tokens });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// User Login
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid Credentials" });
    const tokens = generateTokens(user);
    
    refreshTokens[tokens.refreshToken] = true;
    res.json({ message: "Login Successful", user, ...tokens });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Forgot Password - Send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, userId: user._id };

    await transporter.sendMail({ 
      from: process.env.EMAIL, 
      to: email, 
      subject: "Reset Password OTP", 
      text: `Your OTP: ${otp}` 
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Reset Password - Verify OTP & Update Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const storedData = otpStore[email];

    if (!storedData || storedData.otp !== otp) 
      return res.status(400).json({ message: "Invalid OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(storedData.userId, { password: hashedPassword });

    delete otpStore[email];
    res.json({ message: "Password Reset Successful" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Resend OTP for Verification
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const storedData = otpStore[email];

    if (!storedData) return res.status(400).json({ message: "No OTP request found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email].otp = otp;

    await transporter.sendMail({ 
      from: process.env.EMAIL, 
      to: email, 
      subject: "Resend OTP", 
      text: `Your new OTP: ${otp}` 
    });

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get User Info
// router.get("/user-info", authenticateToken, async (req, res) => {
//   const user = await User.findById(req.user.userId).select("-password");
//   res.json(user);
// });

module.exports = router;
