// routes/otpRoute.js
import express from "express";
const router = express.Router();

import { checkUser } from "../middleware/checkUser.js";

import { sendOTP, verifyOTP } from "../controller/otp.controller.js";


// Send OTP
router.post("/send-otp", checkUser, sendOTP);

// Verify OTP
router.post("/verify-otp", checkUser, verifyOTP);

export default  router;
