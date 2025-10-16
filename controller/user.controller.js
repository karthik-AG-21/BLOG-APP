import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { error } from "console";
import jwt from "jsonwebtoken";




export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                message: "Some field is missing, please check all fields",
                success: false,
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

        return res.render('pages/register', { error: null,
            success: 'Registration successful! Redirecting to login...',
            redirect: true,
        });


    } catch (err) {
        console.error("Something went wrong", err);

        return res.render("pages/register", { error: "Something went wrong while registering. Please try again.",
            success: null
         });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Incorrect email or password" });

        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({ success: false, message: "Incorrect email or password" });

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
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });


        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        } else {
            return res.redirect('/'); // or /user/home or /
        }

    } catch (err) {
        console.log("Something went wrong", err);
        return res.status(500).json({ success: false, message: "Something went wrong while logging in" });
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
        if (!user) return res.status(404).json({
            success: false,
            error: "User not found"
        });
        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};