import express from "express";

import { login, register } from "../controller/user.controller.js";
import isAuthenticated from "../middleware/auth.js";

const router = express.Router();


router.post("/register", register );
router.post("/login", login );

router.get("/redirect", isAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    return res.redirect("/api/admin/dashboard");
  } 

  return res.redirect("/api/user/home");
});

// User home (only for users)
router.get("/home", isAuthenticated, (req, res) => {
  res.send("Welcome Home User");
});

export default router;