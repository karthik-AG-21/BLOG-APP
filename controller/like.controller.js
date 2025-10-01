// controllers/like.controller.js

import { like } from "../models/like.model.js";




export const toggleLike = async (req, res) => {
  try {
    const { id: postId } = req.params; // post id
    const userId = req.user._id;

    // Check if user already liked the post
    const existingLike = await like.findOne({ postId, userId });

    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
      return res.json({ success: true, liked: false });
    } else {
      // Like
      await like.create({ postId, userId });
      return res.json({ success: true, liked: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const countLikes = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const likesCount = await like.countDocuments({ postId });
    res.json({ success: true, likesCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


