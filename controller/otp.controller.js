import { User } from "../models/user.model.js";
import { EMAIL_VERIFY_TEMPLATE } from "../utils/emailTemplates.js";
import transporter from "../utils/email.js";
import crypto from "crypto";


const hashOTP = (otp) => {
  const secret = process.env.OTP_SECRET;
  return crypto.createHmac("sha256", secret).update(otp).digest("hex");
};

export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ message: "Account already verified", success: false });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit OTP

        const hashOTP = (otp) => {
            const secret = process.env.OTP_SECRET;
            return crypto.createHmac("sha256", secret).update(otp).digest("hex");
        };


        user.verifyOtp = hashOTP(otp);
        user.verifyOtpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

        await user.save();

        // Send OTP email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Verify Your Account",
            // text: `Your verification code is: ${otp}. Please verify your account using this OTP.`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };

        await transporter.sendMail(mailOptions);

        return res.json({ message: "Verification code sent successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};







export const verifyOtp = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otp } = req.body;

    if (!otp) return res.status(400).json({ message: "OTP is required", success: false });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found", success: false });

    if (user.verifyOtpExpiresAt < Date.now())
      return res.status(400).json({ message: "OTP has expired", success: false });

    const hashedOtp = hashOTP(otp);
    if (user.verifyOtp !== hashedOtp)
      return res.status(400).json({ message: "Invalid OTP", success: false });

    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpiresAt = undefined;
    await user.save();

    res.json({ message: "Account verified successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
