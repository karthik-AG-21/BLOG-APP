import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token; // make sure cookie-parser is used in server

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false,
            });
        }

        req.user = user; // attach user info to request
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export default isAuthenticated;