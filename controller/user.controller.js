import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { error } from "console";
import jwt from "jsonwebtoken";




export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                  success: "Some field is missing, please check all fields",
              error: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("pages/register", {
                error: "User already exists with this email.",
                success: null
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            phone,
            password: hashedPassword,

        });

        return res.render('pages/register', {
            error: null,
            success: 'Registration successful! Redirecting to login...',
            redirect: true,
        });


    } catch (err) {
        console.error("Something went wrong", err);

        return res.render("pages/register", {
            error: "Something went wrong while registering. Please try again.",
            success: null
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
           return res.render('pages/register', {
                success: false,
                error: "email and password are required fields"
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.render('pages/login', {
                success: false,
                error: "User does not exist. Please register and continue."
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.render('pages/login', {
                success: false,
                error: "Wrong email or password."
            });

        }


        //      if (!user.isVerified) {
        //   return res.status(400).json({
        //     success: false,
        //     message: "Please verify your email via OTP before logging in.",
        //   });
        // }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });

        // Save token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000,

        });

        const redirect = !user.isAccountVerified ? '/otpVarify' : user.role === 'admin' ? '/adminDashboard' : '/userHome';
        res.render('pages/login', {
            error: null,
            success: 'Login successful! Redirecting...',
            redirect
        });

    } catch (err) {
        console.log("Something went wrong", err);
        return res.status(500).json({ success: false, message: "Something went wrong while logging in" });
    }
};


export const logout = async (req, res) => {
    try {
        // Clear JWT token cookie
        res.clearCookie("token"); // Remove the JWT token
        
        return res.redirect("/login");


    } catch (err) {
        console.error("Logout error", err);
        return res.render("pages/login", {
            error: "Something went wrong while logging out. Please try again.",
            success: null
        });
    }
};

// get all users (only by admin)

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // hide sensitive data
        res.json({
            success: true,
            users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({
            success: false,
            error: "User not found"
        });
        res.json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.redirect('/adminDashboard?error=User not found');
    }

    // CORRECT: Use query parameter for success message
    res.redirect('/adminDashboard?success=User deleted successfully');
    
  } catch (err) {
    console.error('Error deleting user:', err);
    // CORRECT: Use query parameter for error message
    res.redirect('/adminDashboard?error=Failed to delete user');
  }
};