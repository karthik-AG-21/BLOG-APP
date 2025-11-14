import { Post } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";

// Create a new post
// export const createPost = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const image = req.file ? req.file.path : null;

//     if (!title || !description || !image) {
//        const posts = await Post.find({ userId: req.user._id });
//       return res.render("pages/myPosts", { error: "All fields are required", success: false, posts });
//     }

//     const post = await Post.create({
//       title,
//       description,
//       image,
//       userId: req.user._id, // attach the logged-in user's ID
//     });

//      const posts = await Post.find({ userId: req.user._id });

//     res.render("pages/myPosts", { success: "post created successfully", error: null, posts });
//   } catch (err) {
//     const posts = await Post.find({ userId: req.user._id });
//     res.render("pages/myPosts", { success: false, error: err.message, posts });
//   }
// };

export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file?.path;

    // Validation
    if (!title?.trim() || !description?.trim() || !image) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields (title, description, image) are required' 
      });
    }

    // Check title and description length
    if (title.length > 200 || description.length > 5000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title or description too long' 
      });
    }

    // Verify user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }

    const post = await Post.create({
      title: title.trim(),
      description: description.trim(),
      image,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });

  } catch (err) {
    console.error('Create post error:', err);
    
    res.status(500).json({
      success: false,
      message: 'Error creating post. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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
// 

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.redirect("/myPosts?error=Post not found");
    }

    // Check if logged-in user is the owner
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/myPosts?error=Not authorized");
    }

    const { title, description } = req.body;
    if (!title || !description) {
      return res.redirect("/myPosts?error=All fields are required");
    }

    if (title) post.title = title;
    if (description) post.description = description;

    if (req.file) {
      post.image = req.file.path;
    }

    await post.save();
    res.redirect("/myPosts?success=Post updated successfully");
  } catch (err) {
    res.redirect("/myPosts?error=" + encodeURIComponent(err.message));
  }
};


// update a post by admin (any post)
export const updatePostByAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.render("pages/adminDashboard", { error: "Post not found" });

    // Admin can update any post, no ownership check

    const { title, description } = req.body;
    if (title) post.title = title;
    if (description) post.description = description;

    if (req.file) {
      post.image = `uploads/${req.file.filename}`; // assuming multer saves in uploads
    }

    await post.save();
   return res.redirect('/adminDashboard?success=Post updated successfully');
  } catch (err) {
    res.render("pages/adminDashboard", {
      success: false,
      error: err.message
    });
  }
};




// Delete a post (only by owner)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    // Check if post exists
    if (!post) {
      const posts = await Post.find({ userId: req.user._id }).sort({ createdAt: -1 });
      return res.render("pages/myPosts", { 
        error: "Post not found", 
        success: null, 
        posts 
      });
    }

    // Check if logged-in user is the owner
    if (post.userId.toString() !== req.user._id.toString()) {
      const posts = await Post.find({ userId: req.user._id }).sort({ createdAt: -1 });
      return res.render("pages/myPosts", { 
        error: "Not authorized to delete this post", 
        success: null, 
        posts 
      });
    }

    await Comment.deleteMany({ post: req.params.id });

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);
    
    // Fetch updated posts list
    const posts = await Post.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    res.render("pages/myPosts", { 
      success: "Post deleted successfully", 
      error: null, 
      posts 
    });
  } catch (err) {
    console.error("Delete post error:", err);
    const posts = await Post.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.render("pages/myPosts", { 
      success: null,
      error: "Failed to delete post: " + err.message, 
      posts 
    });
  }
};


// Delete a post by admin (any post)

export const deletePostByAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
     return res.redirect('/adminDashboard?error=Post not found');
    }

    await Comment.deleteMany({ post: req.params.id });

    await post.deleteOne();
    res.redirect('/adminDashboard?success=Post deleted successfully by admin');
  } catch (err) {
    res.redirect('/adminDashboard?error=' + encodeURIComponent(err.message));
  }
};

