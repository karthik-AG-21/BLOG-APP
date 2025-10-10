// routes/otpRoute.js
import express from "express";
const router = express.Router();

import isAuthenticated from "../middleware/isAuthenticated.js";
import {  sendVerifyOtp, verifyOtp } from "../controller/otp.controller.js";




// Send OTP
router.post("/send-otp", isAuthenticated,sendVerifyOtp);  //  "email": "karthikag.stackup@gmail.com" //1234567

// Verify OTP
router.post("/verify-otp", isAuthenticated, verifyOtp);

export default  router;


