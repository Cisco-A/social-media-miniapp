import express from "express";

import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "./posts.controller.js";


import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  // validation.validate(createPostValidation),
  createPost,
);

router.get("/", authenticate, getPosts);

router.get("/:id", authenticate, getPostById);

router.patch(
  "/:id",
  authenticate,
  // validation.validate(updatePostValidation),
  updatePost,
);

router.delete("/:id", authenticate, deletePost);

export default router;