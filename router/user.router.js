import express from "express";

import { login, logout, register } from "../controller/user.controller.js";
import { addComment, deleteComment, deleteCommentUser, getCommentsForPost,  updateComment } from "../controller/comments.controller.js";
import {  toggleLike } from "../controller/like.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

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

// Logout route
router.get("/logout", isAuthenticated, logout);

// routes/commentRoutes.js



// logged-in users can comment
router.post("/:id/comments", isAuthenticated, addComment);

// get all comments on a post (can be public or protected)
router.get("/:id/comments", getCommentsForPost);

// author can update
router.put("/comments/:id", isAuthenticated, updateComment);

// author or admin can delete
router.delete("/comments/:id", isAuthenticated, deleteComment );




//routes/likeRoutes.js  ---> like router


// Like a post
router.post("/:id/like", isAuthenticated, (req, res, next) => {
  console.log("Like route hit! ID:", req.params.id);
  next();
}, toggleLike);


// Get like count for a post 
// router.get("/count/:id", isAuthenticated, countLikes); 


router.post("/comment/:id", isAuthenticated, updateComment);

router.post('/comment/:id/delete', isAuthenticated, deleteCommentUser);

export default router;