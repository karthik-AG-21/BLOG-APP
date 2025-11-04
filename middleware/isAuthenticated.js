import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token; // make sure cookie-parser is used in server

        if (!token) {
            return res.render("pages/login", {
                error: "User not authenticated. Please login first.",
                success: null
            });
        }



        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return res.render("pages/login", {
                error: "Invalid or expired token. Please login again.",
                success: null
            });
        }
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.render("pages/login", {
                error: "User not found. Please login again.",
                success: null
            });
        }
        req.user = user; // attach user info to request
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        res.render("pages/login", {
            error: "Something went wrong. Please try again.",
            success: null
        });
    }
};

export default isAuthenticated;