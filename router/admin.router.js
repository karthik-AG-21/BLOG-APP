import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import authorizeRole from "../middleware/userRoles.js";
import { deletePostByAdmin, getAllPosts, getPostById,  updatePostByAdmin } from "../controller/blog.controller.js";
import { upload } from "../middleware/multer.js";
import { deleteUser, getAllUsers, getUserById, login } from "../controller/user.controller.js";



const router = express.Router();

router.post("/login", login);

// Admin dashboard
router.get("/dashboard",  isAuthenticated,  authorizeRole(["admin"]),(req, res) => {
        res.send("Welcome Admin Dashboard");
});


    
// Get all posts
router.get("/all", getAllPosts);


// Get post by ID 
router.get("/:id", isAuthenticated, getPostById);


//update  || put by id 
router.put("/:id", isAuthenticated, authorizeRole(["admin"]), upload.single("image"), updatePostByAdmin);

// Delete post  by admin  any post 
router.delete("/:id", isAuthenticated, deletePostByAdmin);


// User management routes (only for admin)

//get all users by Admin
router.get("/all/users", isAuthenticated , getAllUsers);


// get a user by id (only by admin)
router.get("/user/:id", isAuthenticated, getUserById);

//Delete user by id (only by admin)
router.delete("/user/:id", isAuthenticated, deleteUser);




export default router;
