import express from "express";

import {
  register,
  login,
  logout,
  verifyOtp,
  resendOtp,
  resetPassword,
  me,
} from "./auth.controller.js";

import registerValidation from "./auth.validation/register.validation.js";
import loginValidation from "./auth.validation/login.validation.js";
import otpValidation from "./auth.validation/otp.validation.js";

import validation from "../../middlewares/validation.js";
import resendValidation from "./auth.validation/resend.validation.js";
import resetPasswordValidation from "./auth.validation/resetPassword.validation.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validation.validate(registerValidation), register);

router.post("/login", validation.validate(loginValidation), login);

router.post("/verify-otp", validation.validate(otpValidation), verifyOtp);

router.post("/resend-otp", validation.validate(resendValidation), resendOtp);

router.post(
  "/reset-password",
  validation.validate(resetPasswordValidation),
  resetPassword,
);

router.get("/me", authenticate, me);

export default router;
