import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
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
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        return res.redirect("/login");
    } catch (err) {
        console.error("Something went wrong", err);
        return res.status(500).json({
            message: "Something went wrong while registering",
            success: false,
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
            return res.status(200).json({
                success: true,
                message: "Admin login successful",
                role: "admin",
                token // send the JWT
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "User login successful",
                role: "user",
                token
            });
        }

    } catch (err) {
        console.log("Something went wrong", err);
        return res.status(500).json({ success: false, message: "Something went wrong while logging in" });
    }
};