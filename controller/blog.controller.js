import { Post } from "../models/blog.model.js";

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file ? req.file.path : null;

        if (!title || !description || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const post = await Post.create({
            title,
            description,
            image,
            userId: req.user._id, // attach the logged-in user's ID
        });

        res.status(201).json({ success: true, post });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get all posts
export const  getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("userId", ["name", "email"]).lean(); // optional: populate user info
        res.render("pages/posts", { posts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("userId", "email");
        if (!post) return res.status(404).json({ message: "Post not found" });

        res.json({ success: true, post });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update a post (only by owner)  
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check if logged-in user is the owner
        if (post.userId.toString() !== req.user._id.toString()) {
           
            
            
            return res.status(403).json({ message: "Not authorized" });
        }

        const { title, description } = req.body;
        if (title) post.title = title;
        if (description) post.description = description;


        if (req.file) {
            post.image = `uploads/${req.file.filename}`;  // assuming multer saves in uploads
        }

        await post.save();
        res.json({ success: true, post });
    } catch (err) {
        res.status(500).json({
            success: false, 
            error: err.message 
        });
    }
};



// update a post by admin (any post)
export const updatePostByAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Admin can update any post, no ownership check

    const { title, description } = req.body;
    if (title) post.title = title;
    if (description) post.description = description;

    if (req.file) {
      post.image = `uploads/${req.file.filename}`; // assuming multer saves in uploads
    }

    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};




// Delete a post (only by owner)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if logged-in user is the owner
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



// Delete a post by admin (any post)

export const deletePostByAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();
    res.json({ success: true, message: "Post deleted successfully by admin" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

