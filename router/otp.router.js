import express from 'express';
import { sendOTP, verifyOTP } from '../controller/otp.controller.js';


const router = express.Router();

// send OTP to email
router.post('/send', sendOTP);   

// verify OTP
router.post('/verify', verifyOTP); 

export default router;
