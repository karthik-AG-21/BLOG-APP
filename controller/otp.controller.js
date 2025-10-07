
import {  hashOTP } from "../utils/otpUtils.js";
import { sendEmail } from "../utils/email.js";


// controllers/otp.controller.js
import { generateOTP } from "../utils/otpUtils.js";


export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    // Generate OTP
    const otp = generateOTP(); // 6-digit OTP

    // Send OTP via email
    await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}. It will expire in 5 minutes.`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};
