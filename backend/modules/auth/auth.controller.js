import mongoose, { mongo } from "mongoose";
import {
  registerUser,
  loginUser,
  verifyOtpService,
  resendOtpCode,
  resetPasswordService,
} from "./auth.service.js";

// import { forgotPasswordService } from './auth.service.js';
// import { resetPasswordService } from './auth.service.js';

const register = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const user = await registerUser(req.body, session);

      const { code, error, otpCode, successMessage } = user;

      if (error) {
        return res.status(code).json({
          status: false,
          message: error,
        });
      }

      if (otpCode) {
        return res.status(201).json({
          status: true,
          message: successMessage,
          otpCode,
        });
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      status: false,
      message: "Failed to register user",
    });
  } finally {
    await session.endSession();
  }
};

const verifyOtp = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { email, otp } = req.body;

    await session.withTransaction(async () => {
      // Call the verifyOtpService function to verify the OTP
      const { code, error, successMessage, token } = await verifyOtpService(
        email,
        otp,
        session,
      );

      if (error) {
        return res.status(code).json({
          status: false,
          message: error,
        });
      }

      if (token) {
        return res.status(200).json({
          status: true,
          message: successMessage,
          token,
        });
      }
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      status: false,
      message: "Failed to verify OTP",
    });
  } finally {
    await session.endSession();
  }
};
const resendOtp = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { code, error, successMessage, otpCode } = await resendOtpCode(
      req.body,
      session,
    );
    if (error) {
      return res.status(code).json({
        status: false,
        message: error,
      });
    }

    if (otpCode) {
      return res.status(200).json({
        status: true,
        message: successMessage,
        otpCode,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Unable to resend otp code",
    });
  } finally {
    await session.endSession();
  }
};
const resetPassword = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { code, error, successMessage } = await resetPasswordService(
      req.body,
      session,
    );
    if (error) {
      return res.status(code).json({
        status: false,
        message: error,
      });
    }

    return res.status(200).json({
      status: true,
      message: successMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Unable to reset password",
    });
  } finally {
    await session.endSession();
  }
};

const login = async (req, res) => {
  try {
    const { code, error, token } = await loginUser(req.body);

    if (error) {
      return res.status(code).json({
        status: false,
        message: error,
      });
    }

    res.status(200).json({
      status: true,
      message: "You logged in successfully",
      data: {
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Unable to login at the available",
    });
  }
};

const logout = async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "You logged out successfully",
  });
};

// const forgotPassword = async (req, res) => {
//   try {
//     await forgotPasswordService(req.body.email);

//     res.status(200).json({
//       status: 'success',
//       message: 'Password reset email sent'
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: 'error',
//       message: error.message
//     });
//   }
// };

//  const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     await resetPasswordService(token, password);

//     res.status(200).json({
//       status: 'success',
//       message: 'Password reset successfully'
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: 'error',
//       message: error.message
//     });
//   }
// };

export { register, login, logout, verifyOtp, resendOtp, resetPassword };
