// controllers/otpController.js

import { generateOTP, hashOTP } from "../utils/otpUtils.js";


// In-memory store for OTPs: { userId: { otpHash, expiresAt } }
const otpStore = {};

export const sendOTP = async function (req, res) {
  try {
    const otp = generateOTP();
    const hashedOtp = hashOTP(otp);

    // Store in-memory with expiry (5 minutes)
    otpStore[req.user._id] = {
      otpHash: hashedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    // Send OTP to user (email/SMS)
    console.log("Send this OTP to user:", otp); // replace with real send logic

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const verifyOTP = async function (req, res) {
  try {
    const { otp } = req.body;
    const record = otpStore[req.user._id];

    if (!record || record.expiresAt < Date.now()) {
      return res.status(400).json({ error: "OTP expired or not found" });
    }

    const hashedOtp = hashOTP(otp);
    if (hashedOtp !== record.otpHash) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP valid → proceed (login, verify, etc.)
    delete otpStore[req.user._id]; // remove used OTP
    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};
