import express from 'express';

import {
  register,
  login,
  logout,
  verifyOtp
  // forgotPassword,
  // resetPassword
} from './auth.controller.js';

import registerValidation from './auth.validation/register.validation.js';
import loginValidation from './auth.validation/login.validation.js';
import otpValidation from './auth.validation/otp.validation.js';

import validation from '../../middlewares/validation.js';

const router = express.Router();

router.post(
  '/register',
  validation.validate(registerValidation),
  register
);

router.post(
  '/login',
  validation.validate(loginValidation),
  login
);

router.post(
  '/verify-otp',
  validation.validate(otpValidation),
  verifyOtp
)



// router.post(
//   '/forgot-password',
//   forgotPassword
// );

// router.post(
//   '/reset-password/:token',
//   resetPassword
// );

export default router;