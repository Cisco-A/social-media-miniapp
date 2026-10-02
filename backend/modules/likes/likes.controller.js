import {
  createLikeService,
  getLikesByPostId,
 unlikePostService
} from './likes.service.js';

const createLike = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("POST ID:", req.params.postId);

    const userId = req.user.userId;
    const { postId } = req.params;

    const like = await createLikeService(
      userId,
      postId
    );

    res.status(201).json({
      status: true,
      message: 'Post liked successfully',
      like
    });
  } catch (error) {
    console.error("CREATE LIKE ERROR:", error);

    res.status(500).json({
      status: false,
      message: 'Failed to like the post',
      error: error.message
    });
  }
};

const getLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const likes = await getLikesByPostId(postId);

    res.status(200).json({
      status: true,
      message: 'Likes retrieved successfully',
      likes
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'Failed to get all likes'
    });
  }
};


const unlikePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const like = await unlikePostService(
      userId,
      postId
    );

    if (!like) {
      return res.status(404).json({
        status: false,
        message: 'Like not found'
      });
    }

    res.status(200).json({
      status: true,
      message: 'Post unliked successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to unlike the post'
    });
  }
};

export {
  createLike,
  getLikes,
   unlikePost
};