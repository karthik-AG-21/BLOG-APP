import { User } from "../models/user.model.js";
import { EMAIL_VERIFY_TEMPLATE } from "../utils/emailTemplates.js";
import transporter from "../utils/email.js";

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

        user.verifyOtp = otp;
        user.verifyOtpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

        await user.save();

        // Send OTP email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Verify Your Account",
            // text: `Your verification code is: ${otp}. Please verify your account using this OTP.`,
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };

        await transporter.sendMail(mailOptions);

        return res.json({ message: "Verification code sent successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

