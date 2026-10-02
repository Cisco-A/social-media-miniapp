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

const FRONTEND_URL = process.env.FRONTEND_URL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// await transporter.verify();

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
export const sendWelcomeEmail = async (email, name) => {
  try {
    const info = await transporter.sendMail({
      from: "admin.mingle-social@app.com",
      to: [email],
      subject: "Welcome Message from Mingle social app 👥",
      html: `
      <div>
        <h1>Hi ${name} 👋</h1>
        <img 
          src="${FRONTEND_URL}/public/mingle-logo.svg" 
          alt="Mingle social app logo" 
          width="300" 
          height="200" 
          border="0" 
          style="display: block; width: 100%; max-width: 300px; height: auto;"
        /> 
        <p>Welcome to Mingle social app</p>
        <p>Feel free to share ideas and how you feel on our platform, react on other people's post</p>
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
