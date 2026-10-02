import Like from "./likes.schema.js";
import Post from "../posts/posts.schema.js";

const createLikeService = async (userId, postId) => {
  const like = new Like({
    userId,
    postId
  });

  const savedLike = await like.save();

  await Post.findByIdAndUpdate(
    postId,
    { $inc: { likesCount: 1 } }
  );

  return savedLike;
};

const getLikesByPostId = async (postId) => {
  return Like.find({ postId })
    .populate("userId", "_id");
};

const unlikePostService = async (userId, postId) => {
  const like = await Like.findOneAndDelete({
    userId,
    postId
  });

  if (like) {
    await Post.findByIdAndUpdate(
      postId,
      { $inc: { likesCount: -1 } }
    );
  }

  return like;
};

export {
  createLikeService,
  getLikesByPostId,
  unlikePostService
};