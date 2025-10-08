import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    default: null,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: 'user'
  },
  verifyOtp: {
    type: String,
    default: ""
  },
  verifyOtpExpiresAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
}, {
  timestamps: true
})


export const User = mongoose.model('User', userSchema)