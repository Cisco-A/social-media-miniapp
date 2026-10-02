import express from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
  updateComment,
} from "./comments.controller.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/posts/:postId", getCommentsByPost);
router.post("/posts/:postId", authenticate, createComment);
router.patch("/:commentId", authenticate, updateComment);
router.delete("/:commentId", authenticate, deleteComment);

export default router;
