import {
  createPostService,
  getPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} from "./posts.service.js";

const respond = (res, result) => {
  const { code, error, successMessage, ...data } = result;

  if (error) {
    return res.status(code).json({ status: false, message: error });
  }

  return res.status(code).json({
    status: true,
    message: successMessage,
    data,
  });
};

const createPost = async (req, res) => {
  try {
    const result = await createPostService(req.user.userId, req.body);
    return respond(res, result);
  } catch (error) {
    console.error("Error creating post:", error);
    return res
      .status(500)
      .json({ status: false, message: "Failed to create post" });
  }
};

const getPosts = async (req, res) => {
  try {
    const result = await getPostsService(req.query);
    return respond(res, result);
  } catch (error) {
    console.error("Error getting posts:", error);
    return res
      .status(500)
      .json({ status: false, message: "Failed to get posts" });
  }
};

const getPostById = async (req, res) => {
  try {
    const result = await getPostByIdService(req.params.id);
    return respond(res, result);
  } catch (error) {
    console.error("Error getting post:", error);
    return res
      .status(500)
      .json({ status: false, message: "Failed to get post" });
  }
};

const updatePost = async (req, res) => {
  try {
    const result = await updatePostService(
      req.user.userId,
      req.params.id,
      req.body,
    );
    return respond(res, result);
  } catch (error) {
    console.error("Error updating post:", error);
    return res
      .status(500)
      .json({ status: false, message: "Failed to update post" });
  }
};

const deletePost = async (req, res) => {
  try {
    const result = await deletePostService(req.user.userId, req.params.id);
    return respond(res, result);
  } catch (error) {
    console.error("Error deleting post:", error);
    return res
      .status(500)
      .json({ status: false, message: "Failed to delete post" });
  }
};

export { createPost, getPosts, getPostById, updatePost, deletePost };
