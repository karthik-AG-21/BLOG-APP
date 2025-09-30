// models/Comment.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // who wrote the comment
    },
    targetUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // on whom the comment is made
    },
  },
  { timestamps: true }
);

export default model("Comment", commentSchema);
