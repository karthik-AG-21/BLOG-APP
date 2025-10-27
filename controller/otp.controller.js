import { User } from "../models/user.model.js";
import { EMAIL_VERIFY_TEMPLATE } from "../utils/emailTemplates.js";
import transporter from "../utils/email.js";
import crypto from "crypto";
import { Post } from "../models/blog.model.js";
import { error } from "console";


const hashOTP = (otp) => {
  const secret = process.env.OTP_SECRET;
  return crypto.createHmac("sha256", secret).update(otp).digest("hex");
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log(req.user);
    const user = await User.findById(userId);
    // console.log("user",user)

    if (!user) {
      return res.render('pages/otpVarify', {
        message: "User not found",
        user,
        success: false
      });
    }

    if (user.isAccountVerified) {
      if (user.isVerified) {
        return res.render('pages/otpVarify', {
          error: "Account already verified",
          user,
          success: false
        });
      }
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


    const posts = await Post.find().populate('userId').sort({ createdAt: -1 });

    // Render EJS with OTP modal active and posts
    return res.render('pages/otpVarify', {
      posts,
      user,
      showVerificationModal: false, // hide first modal
      showOtpModal: true,           // show otp modal
      otpSentMessage: true,
      success: "Verification code sent successfully.",
      error: null
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};







export const verifyOtp = async (req, res) => {
  try {
    // const userId = req.user._id;
    // const { otp } = req.body;

    const userId = req.user._id;
    const otpArray = req.body.otp;        // ['1','2','3','4','5','6']
    const otp = otpArray.join('');  

    if (!otp) {
      return res.render('pages/otpVarify', { error: "OTP is required", success: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.render('pages/otpVarify', { error: "User not found", success: false });
    }


     if (user.verifyOtpExpiresAt < Date.now()) {
      return res.render('pages/otpVarify', { error: "OTP has expired", success: false });
    }


    const hashedOtp = hashOTP(otp);
    if (user.verifyOtp !== hashedOtp) {
      return res.render('pages/otpVarify', { error: "Invalid OTP", success: false });
    }

    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpiresAt = undefined;
    await user.save();
   res.redirect("/pages/userHome.ejs"); 

    return res.render('pages/otpVarify', {success: "Account verified successfully",  error: null});
  } catch (error) {
    return res.render('pages/otpVarify', { error: error.message, success: false });
  }
};
