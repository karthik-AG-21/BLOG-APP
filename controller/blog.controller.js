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
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name email"); // optional: populate user info

    

    res.render("pages/posts");
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// Get only logged-in user's posts
export const getMyPosts = async (req, res) => {
  try {
    // Get the logged-in user's ID from session/token
    const userId = req.user._id; // This comes from your authentication middleware
    
    // Find all posts where userId matches the logged-in user
    const posts = await Post.find({ userId: userId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 }); // Sort by newest first
    
    if (!posts || posts.length === 0) {
      return res.render("pages/myPosts", { 
        error: null,
        success: null, 
        posts: [] 
      });
    }

    res.render("pages/myPosts", {
      error: null,
      success: null,
      posts: posts
    });
  } catch (err) {
    res.render("pages/myPosts", { 
      error: err.message,
      success: false,
      posts: [] 
    });
  }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.body.id).populate("userId", "name email");
    if (!post) return res.render("pages/myPosts", { error: "Post not found" ,  success: false, post:[]});

    res.render("pages/myPosts", {error: null , success: true, post });
  } catch (err) {
    res.render("pages/myPosts", { success: false, error: err.message });
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

