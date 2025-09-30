import express from "express";
import isAuthenticated from "../middleware/auth.js";
import authorizeRole from "../middleware/userRoles.js";
import { deletePostByAdmin, getAllPosts, getPostById, updatePost, updatePostByAdmin } from "../controller/blog.controller.js";
import { upload } from "../middleware/multer.js";



const router = express.Router();



// Admin dashboard
router.get("/dashboard",  isAuthenticated,  authorizeRole(["admin"]),(req, res) => {
        res.send("Welcome Admin Dashboard");
});



// Get all posts
router.get("/all", getAllPosts);


// Get post by ID 
router.get("/:id", isAuthenticated, getPostById);


//update  || put by id 
router.put("/:id", isAuthenticated, upload.single("image"), updatePostByAdmin);

// Delete post  by admin  any post 
router.delete("/:id", isAuthenticated, deletePostByAdmin);


export default router;
