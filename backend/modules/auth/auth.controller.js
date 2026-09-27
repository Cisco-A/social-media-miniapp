import { registerUser, loginUser, verifyOtpService } from './auth.service.js';

// import { forgotPasswordService } from './auth.service.js';
// import { resetPasswordService } from './auth.service.js';

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    const {code, error, otpCode, successMessage} = user;
    if(error) {
      return res.status(code).json({
        status: false,
        message: error
      });
    }

    if(otpCode) {
      return res.status(201).json({
        status: true,
        message: successMessage,
        otpCode
      });
    }



    // const { passwordHash, ...safeUser } = user.toObject();

    // res.status(201).json({
    //   status: true,
    //   message: 'You registered successfully',
    //   user: safeUser
    // });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to register user'
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Call the verifyOtpService function to verify the OTP
    const { code, error, successMessage, token} = await verifyOtpService(email, otp);
if (error) {
      return res.status(code).json({
        status: false,
        message: error
      });
    }
    if(token) {
      return res.status(200).json({
        status: true,
        message: successMessage,
        token
      });
    }

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to verify OTP'
    });
  }
};

const login = async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);

    const { passwordHash, ...safeUser } = user.toObject();

    res.status(200).json({
      status: 'success',
      message: 'You logged in successfully',
      user: safeUser,
      token
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

const logout = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'You logged out successfully'
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




export { register, login,logout, verifyOtp
 };


