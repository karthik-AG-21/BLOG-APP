// routes/otpRoute.js
import express from "express";
const router = express.Router();

import { checkUser } from "../middleware/checkUser.js";
import { generateOTP, verifyOTP } from "../utils/otpUtils.js";


// Send OTP
router.post("/send-otp", checkUser, generateOTP);

// Verify OTP
router.post("/verify-otp", checkUser, verifyOTP);

export default  router;
