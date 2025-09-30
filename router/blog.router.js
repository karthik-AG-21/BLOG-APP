import express from "express";
import isAuthenticated from "../middleware/auth.js";
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "../controller/blog.controller.js";
import { upload } from "../middleware/multer.js";


const router = express.Router();

// Create post with image upload
router.post("/create", isAuthenticated, upload.single("image"), createPost);

// Get all posts
router.get("/all", getAllPosts);

// Get post by ID 
router.get("/:id", isAuthenticated, getPostById);


//update  || put by id    68da67e48775260f2ad9602d
router.put("/:id", isAuthenticated, upload.single("image"), updatePost);


// Delete post by ID 
router.delete("/:id", isAuthenticated, deletePost);

export default router;
