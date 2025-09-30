// controllers/commentController.js
import Comment from "../models/comment.model.js";

// CREATE comment
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const targetUserId = req.params.userId; // user to whom comment is added

        const comment = await Comment.create({
            text,
            author: req.user._id,    // logged-in user (from middleware)
            targetUser: targetUserId
        });

        res.json({
            success: true,
            comment
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};




// READ comments for a user
export const getCommentsForUser = async (req, res) => {
    try {
        const comments = await Comment.find({ targetUser: req.params.userId })
            .populate("author", "name email"); // show author details

        res.json({
            success: true,
            comments
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// UPDATE comment (only author can edit)
export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findOneAndUpdate(
            { _id: req.params.id, author: req.user._id }, // only author
            { text: req.body.text },
            { new: true }
        );

        if (!comment) return res.status(404).json({
            success:
                false,
            error: "Not allowed or not found"
        });
        res.json({
            success: true,
            comment
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// DELETE comment (author or admin)
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({
            success: false,
            error: "Comment not found"
        });

        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                error: "Not authorized"
            });
        }

        await comment.deleteOne();
        res.json({
            success: true,
            message: "Comment deleted"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
