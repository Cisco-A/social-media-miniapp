// import { Resend } from "resend";
// import dotenv from "dotenv";

// dotenv.config();

// const resend = new Resend(process.env.RESEND_PUBLIC_KEY);

// export const sendEmailVerificationOtp = async (email, otp) => {
//   const { data, error } = await resend.emails.send({
//     from: "Your App <onboarding@resend.dev>",
//     to: [email],
//     subject: "Your OTP Code 🔐",

//     html: `
//       <div>
//         <h1>Here is your otp code:</h1>

//         <h2>${otp}</h2>

//         <p>
//           This OTP will expire in 10 minutes.
//         </p>

//         <p>
//           If you did not request a password reset,
//           you can safely ignore this email.
//         </p>
//         <p>&copy; ${new Date().getFullYear()} · Mini Social Media app</p>
//         <p>Made with ❤️ by Group 20</p>
//       </div>
//     `,
//   });

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// };

// export const sendResetOtpEmail = async (email, otp) => {
//   const { data, error } = await resend.emails.send({
//     from: "Your App <onboarding@resend.dev>",
//     to: [email],
//     subject: "Your Password Reset OTP 🔐",

//     html: `
//       <div>
//         <h1>Password Reset</h1>

//         <p>You requested to reset your password.</p>

//         <p>Your OTP is:</p>

//         <h2>${otp}</h2>

//         <p>
//           This OTP will expire in 10 minutes.
//         </p>

//         <p>
//           If you did not request a password reset,
//           you can safely ignore this email.
//         </p>
//       </div>
//     `,
//   });

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// };

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmailVerificationOtp = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: "Your App <onboarding@resend.dev>",
      to: [email],
      subject: "Your Email verification OTP Code 🔐",
      html: `
      <div>
        <h1>Here is your otp code:</h1>

        <h2>${otp}</h2>

        <p>
          This OTP will expire in 10 minutes.
        </p>

        <p>
          If you did not request a password reset,
          you can safely ignore this email.
        </p>
        <p>&copy; ${new Date().getFullYear()} · Mini Social Media app</p>
        <p>Made with ❤️ by Group 20</p>
      </div>
    `,
    });
    console.log("Email sent successfully", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendResetOtpEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: "admin.mingle-social@app.com",
      to: [email],
      subject: "Your Reset OTP Code 🔐",
      html: `
      <div>
        <h1>Here is your otp code:</h1>

        <h2>${otp}</h2>

        <p>
          This OTP will expire in 10 minutes.
        </p>

        <p>
          If you did not request a password reset,
          you can safely ignore this email.
        </p>
        <p>&copy; ${new Date().getFullYear()} · Mini Social Media app</p>
        <p>Made with ❤️ by Group 20</p>
      </div>
    `,
    });
    console.log("Email sent successfully", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
