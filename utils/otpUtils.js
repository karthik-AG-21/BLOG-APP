import crypto from "crypto";

// Generate a random 6-digit OTP
export const generateOTP = (length = 6) => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash the OTP using SHA-256 for security
export const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
