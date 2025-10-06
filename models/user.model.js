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
    isVarified: {
      type: Boolean,      // when user registers, by default it is false 0     
      default: false      //  then if the user varifies email it becomes true 1                 
    },                  
}, {
  timestamps: true
})


export const User = mongoose.model('User', userSchema)