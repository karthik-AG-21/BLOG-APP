import { Post } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";




// ADD a comment to a post
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;

    if (!text) return res.status(400).json({ success: false, error: "Text is required" });

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const comment = await Comment.create({
      text,
      userId: req.user._id,
      postId: postId
    });

    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
    
    res.redirect('/userHome');
  } catch (err) {
    console.error(err);
    res.redirect('/userHome');
  }
};

// GET all comments for a post
export const getCommentsForPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// UPDATE a comment (only by author)
export const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const commentId = req.params.id;

    let comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, error: "Comment not found" });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    comment.text = text || comment.text;
    await comment.save();

    res.json({ success: true, data: comment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE a comment (only by author or admin)
 export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    let comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, error: "Comment not found" });

    // Only admin can delete
    if (req.user.role !== "admin") {
      return res.redirect("/adminDashboard?error=Not authorized");
    }

    await Comment.findByIdAndDelete(commentId);

    res.redirect('/adminDashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/adminDashboard');
  }
};