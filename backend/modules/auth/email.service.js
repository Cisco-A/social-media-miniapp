import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL;
const FROM_ADDRESS = process.env.EMAIL_FROM;

export const sendEmailVerificationOtp = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject: "Your Email Verification OTP Code 🔐",
      html: `
      <div>
        <h1>Here is your OTP code:</h1>

        <h2>${otp}</h2>

        <p>
          This OTP will expire in 10 minutes.
        </p>

        <p>
          If you did not request this,
          you can safely ignore this email.
        </p>
        <p>&copy; ${new Date().getFullYear()} · Mini Social Media app</p>
        <p>Made with ❤️ by Group 20</p>
      </div>
    `,
    });

    if (error) {
      console.error("[email] Failed to send verification OTP:", error.message);
      throw new Error(error.message);
    }

    console.log("[email] Verification OTP sent successfully", data?.id);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendResetOtpEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject: "Your Password Reset OTP Code 🔐",
      html: `
      <div>
        <h1>Password Reset</h1>

        <p>You requested to reset your password.</p>

        <p>Your OTP is:</p>

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

    if (error) {
      console.error("[email] Failed to send reset OTP:", error.message);
      throw new Error(error.message);
    }

    console.log("[email] Reset OTP sent successfully", data?.id);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject: "Welcome to Mingle Social App 👥",
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
        <p>Feel free to share ideas and how you feel on our platform, react on other people's posts</p>
        <p>&copy; ${new Date().getFullYear()} · Mini Social Media app</p>
        <p>Made with ❤️ by Group 20</p>
      </div>
    `,
    });

    if (error) {
      console.error("[email] Failed to send welcome email:", error.message);
      throw new Error(error.message);
    }

    console.log("[email] Welcome email sent successfully", data?.id);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
