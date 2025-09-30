import express from "express";

import { login, register } from "../controller/user.controller.js";
import isAuthenticated from "../middleware/auth.js";
import { addComment, deleteComment, getCommentsForUser, updateComment } from "../controller/comments.controller.js";

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


// routes/commentRoutes.js



// logged-in users can comment
router.post("/:userId/comments", isAuthenticated, addComment);

// get all comments on a user (can be public or protected)
router.get("/:userId/comments", isAuthenticated, getCommentsForUser);

// author can update
router.put("/comments/:id", isAuthenticated, updateComment);

// author or admin can delete
router.delete("/comments/:id", isAuthenticated, deleteComment);




export default router;