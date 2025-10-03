// utils/otpUtils.js
import  crypto from "crypto";

export const generateOTP = function (length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOTP = function (otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
