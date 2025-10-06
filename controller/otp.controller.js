// controllers/otp.controller.js
import { generateOTP } from "../utils/otpUtils.js";
import { sendMail } from "../utils/email.js";
import { User } from "../models/user.model.js";

// Temporary variable to store OTPs (for demo use only)
let otpStore = {};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = generateOTP();
    otpStore[email] = otp; // Store OTP in memory (not DB)

    await sendMail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
      html: `<p>Your OTP is <b>${otp}</b></p>`,
    });

    console.log("Generated OTP:", otp);

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (otpStore[email] && otpStore[email] === otp) {
      await User.findOneAndUpdate({ email }, { isVerified: true });
      delete otpStore[email]; // remove OTP from memory

      return res.json({ success: true, message: "OTP verified successfully!" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
