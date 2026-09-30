import express from "express";
import { getUser, getUsers, updateUser } from "./users.controller.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.patch("/update-profile", authenticate, updateUser);

export default router;
