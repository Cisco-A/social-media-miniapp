import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
import { generateOtp } from '../../config/otp.js'; 
import Otp from './otp.schema.js';

import User from './auth.schema.js';
// import { sendResetOtpEmail } from './email.service.js';


const registerUser = async ({
  displayName,
  username,
  email,
  password,
  gender,
  bio,
  avatarUrl
}) => {

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    // throw new Error('User already exists');
    return {  
      code: 409,
      error: 'User already exists'
    }
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    displayName,
    username,
    email,
    passwordHash,
    gender,
    bio,
    avatarUrl
  });

  let otpCode = "";

  if (user){
    otpCode = generateOtp();
  }
  const otpHash = await bcrypt.hash(otpCode, 12);

  const otp = await Otp.create({
    user: user._id,
    codeHash: otpHash,
    purpose: 'emailVerification'
  });

  return {
    otpCode,
    successMessage: 'User registered successfully. Please verify your email using the OTP sent to your email address.',
  };
};

const verifyOtpService = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      code: 404,
      error: 'User not found'
    }
    // throw new Error('User not found');
  }

  const otpRecord = await Otp.findOne({
    user: user._id,
    purpose: 'emailVerification'
  });

  if (!otpRecord) {
       return {
      code: 404,
      error: 'Otp not found'
    }
    // throw new Error('OTP not found');
  }

  const isOtpValid = await bcrypt.compare(otp, otpRecord.codeHash);

  if (!isOtpValid) {
       return {
      code: 400,
      error: 'Invalid OTP'
    }
    // throw new Error('Invalid OTP');
  }

  // Mark the user's email as verified
  user.emailVerified = true;
  await user.save();

  // Optionally, you can delete the OTP record after successful verification
  await Otp.deleteOne({ _id: otpRecord._id });

  const token = jwt.sign(
    {
      userId: user._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );

  return {
    successMessage: 'OTP verified successfully',
    token
  };

};


const loginUser = async ({ email, password }) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    {
      userId: user._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );

  return {
    user,
    token
  };
};


// const forgotPasswordService = async (email) => {
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error('User not found');
//   }

//   const otp = crypto
//     .randomInt(100000, 1000000)
//     .toString();

//   const hashedOtp = await bcrypt.hash(otp, 10);

//   user.resetPasswordOtp = hashedOtp;

//   user.resetPasswordOtpExpires =
//     new Date(Date.now() + 10 * 60 * 1000);

//   user.resetPasswordOtpAttempts = 0;

//   await user.save();

//   await sendResetOtpEmail(user.email, otp);

//   return {
//     message: 'OTP sent to your email'
//   };
// };


// const resetPasswordService = async (
//   email,
//   otp,
//   newPassword
// ) => {
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error('Invalid request');
//   }

//   if (
//     !user.resetPasswordOtp ||
//     !user.resetPasswordOtpExpires
//   ) {
//     throw new Error('Invalid or expired OTP');
//   }

//   if (
//     user.resetPasswordOtpExpires < new Date()
//   ) {
//     throw new Error('OTP has expired');
//   }

//   if (user.resetPasswordOtpAttempts >= 5) {
//     throw new Error('Too many OTP attempts');
//   }

//   const isOtpValid = await bcrypt.compare(
//     otp,
//     user.resetPasswordOtp
//   );

//   if (!isOtpValid) {
//     user.resetPasswordOtpAttempts += 1;

//     await user.save();

//     throw new Error('Invalid OTP');
//   }

//   const passwordHash = await bcrypt.hash(
//     newPassword,
//     10
//   );

//   user.passwordHash = passwordHash;

//   // Clear OTP after successful reset
//   user.resetPasswordOtp = null;
//   user.resetPasswordOtpExpires = null;
//   user.resetPasswordOtpAttempts = 0;

//   await user.save();

//   return {
//     message: 'Password reset successfully'
//   };
// };


export {
  registerUser,
  loginUser,
  verifyOtpService
  // forgotPasswordService,
  // resetPasswordService
};