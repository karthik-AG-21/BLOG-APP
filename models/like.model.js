// models/Like.js
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
},
    { timestamps: true });

// Optional: prevent duplicate likes for same user & post
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const like = mongoose.model("Like", likeSchema);
