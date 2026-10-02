import express from 'express';

import {
  createLike,
  getLikes,
  unlikePost
} from './likes.controller.js';

import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/:postId', authenticate, createLike);

router.get('/:postId', authenticate, getLikes);

router.delete('/:postId', authenticate, unlikePost);

export default router;