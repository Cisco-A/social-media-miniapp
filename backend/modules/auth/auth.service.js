import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import crypto from 'crypto';
import { generateOtp } from "../../config/otp.js";
import Otp from "./otp.schema.js";

import User from "../users/users.schema.js";
import {
  sendEmailVerificationOtp,
  sendResetOtpEmail,
  sendWelcomeEmail,
} from "./email.service.js";
import { usernameGenerator } from "../../config/usernameGenerator.js";
// import { sendResetOtpEmail } from './email.service.js';

const registerUser = async (
  { displayName, email, password, gender, bio, avatarUrl },
  session,
) => {
  const existingUser = await User.findOne({
    $or: [{ email }],
  }).session(session);

  if (existingUser) {
    return {
      code: 409,
      error: "User already exists",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create(
    [
      {
        displayName,
        email,
        username: usernameGenerator(),
        passwordHash,
        gender,
        bio,
        avatarUrl,
      },
    ],
    { session },
  );

  let otpCode = "";

  if (user) {
    otpCode = generateOtp();
  }
  const otpHash = await bcrypt.hash(otpCode, 12);

  await Otp.create(
    [
      {
        user: user[0]._id,
        codeHash: otpHash,
        purpose: "emailVerification",
      },
    ],
    { session },
  );

  // Send otp mail for email verification
  await sendEmailVerificationOtp(email, otpCode);

  return {
    otpCode,
    successMessage:
      "User registered successfully. Please verify your email using the OTP sent to your email address.",
  };
};

const verifyOtpService = async (email, otp, session) => {
  const user = await User.findOne({ email }).session(session);

  if (!user) {
    return {
      code: 404,
      error: "User not found",
    };
    // throw new Error('User not found');
  }

  const otpRecord = await Otp.findOne({
    user: user._id,
    purpose: "emailVerification",
  }).session(session);

  if (!otpRecord) {
    return {
      code: 404,
      error: "Otp not found",
    };
    // throw new Error('OTP not found');
  }

  const isOtpValid = await bcrypt.compare(otp, otpRecord.codeHash);

  if (!isOtpValid) {
    return {
      code: 400,
      error: "Invalid OTP",
    };
    // throw new Error('Invalid OTP');
  }

  if (user.emailVerified) {
    return {
      code: 401,
      error: "Email is already verified",
    };
  }

  // Mark the user's email as verified
  user.emailVerified = true;
  await user.save();

  // Optionally, you can delete the OTP record after successful verification
  await Otp.deleteOne({ _id: otpRecord._id }).session(session);

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );

  return {
    successMessage: "OTP verified successfully",
    token,
    user,
  };
};

const resendOtpCode = async ({ email, purpose }, session) => {
  const user = await User.findOne({ email }).session(session);

  if (!user) {
    return {
      code: 404,
      error: "User not found",
    };
  }

  if (user.emailVerified && purpose === "emailVerification") {
    return {
      code: 400,
      error: "Email is already verified",
    };
  }

  const otpExist = await Otp.findOne({
    user: user._id,
    purpose,
  }).session(session);

  const otpCode = generateOtp();
  const otpHash = await bcrypt.hash(otpCode, 12);

  if (otpExist) {
    await Otp.findByIdAndDelete(otpExist._id).session(session);
  }
  await Otp.create(
    [
      {
        user: user._id,
        purpose,
        codeHash: otpHash,
      },
    ],
    { session },
  );

  if (purpose === "emailVerification") {
    await sendEmailVerificationOtp(email, otpCode);
  }

  if (purpose === "resetPassword") {
    await sendResetOtpEmail(email, otpCode);
  }

  return {
    successMessage: "A new otp has been sent to the email provided",
    otpCode,
  };
};

const resetPasswordService = async ({ email, otp, newPassword }, session) => {
  const user = await User.findOne({ email }).session(session);

  if (!user) {
    return {
      code: 404,
      error: "User not found",
    };
  }

  const otpExist = await Otp.findOne({
    user: user._id,
    purpose: "resetPassword",
  }).session(session);

  if (!otpExist) {
    return {
      code: 404,
      error: "No otp found",
    };
  }

  const otpMatch = await bcrypt.compare(otp, otpExist.codeHash);

  if (!otpMatch) {
    return {
      code: 400,
      error: "Invalid otp",
    };
  }

  await Otp.findByIdAndDelete(otpExist._id).session(session);

  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Update user password
  user.passwordHash = passwordHash;

  await user.save(session);

  return {
    successMessage: "Password reset was successful",
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      code: 400,
      error: "Invalid Credentials",
    };
    // throw new Error('Invalid email or password');
  }

  if (!user.emailVerified) {
    return {
      code: 400,
      error: "Email is not verified",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return {
      code: 400,
      error: "Invalid Credentials",
    };
    // throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );

  return {
    user,
    token,
  };
};

const meService = async (userId) => {
  const user = await User.findById(userId);
  return {
    user,
  };
};

export {
  registerUser,
  loginUser,
  verifyOtpService,
  resendOtpCode,
  resetPasswordService,
  meService,
};
