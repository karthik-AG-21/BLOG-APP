// controllers/like.controller.js


import { Post } from "../models/blog.model.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";

export const toggleLike = async (req, res) => {
  try {
    const postId = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user._id;

    console.log("PostId:", postId, "UserId:", userId);

    const existingLike = await Like.findOne({ postId, userId });
    console.log("Existing like:", existingLike);

    if (existingLike) {
      const deleted = await Like.deleteOne({ _id: existingLike._id });
      console.log("Deleted:", deleted);
      await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
      console.log("Unlike successful");
    } else {
      const created = await Like.create({ postId, userId });
      console.log("Created like:", created);
      await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
      console.log("Like successful");
    }
    
    res.redirect('/userHome?success=Like updated');
  } catch (error) {
    console.error("Like error:", error);
    res.redirect('/userHome?error=' + error.message);
  }
};
// export const countLikes = async (req, res) => {
//   try {
//     const { id: postId } = req.params;
//     const likesCount = await Like.countDocuments({ postId });
//     res.render("/pages/userHome",{ success: true, likesCount });
//   } catch (error) {
//     res.status(500).render("/pages/userHome",{ success: false, message: error.message });
//   }
// };


