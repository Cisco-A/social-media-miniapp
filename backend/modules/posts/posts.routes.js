import express from "express";

import {
  createPost,
  getPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
} from "./posts.controller.js";

import authenticate from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";

const router = express.Router();


router.post(
  "/",
  authenticate,
  upload.array("images", 5),
  // validation.validate(createPostValidation),
  createPost,
);


router.get("/", authenticate, getPosts);

router.get("/me", authenticate, getMyPosts);

router.get("/:id", authenticate, getPostById);

router.patch(
  "/:id",
  authenticate,
  upload.array("images", 5),
  // validation.validate(updatePostValidation),
  updatePost,
);


router.delete("/:id", authenticate, deletePost);

export default router;
