import express from "express";
import isAuthenticated from "../middleware/auth.js";
import authorizeRole from "../middleware/userRoles.js";



const router = express.Router();



// Admin dashboard
router.get("/dashboard",  isAuthenticated,  authorizeRole(["admin"]),(req, res) => {
        res.send("Welcome Admin Dashboard");
});

export default router;
