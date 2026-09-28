// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_PUBLIC_KEY);

// export const sendResetOtpEmail = async (email, otp) => {
//   const { data, error } = await resend.emails.send({
//     from: 'Your App <onboarding@resend.dev>',
//     to: [email],
//     subject: 'Your Password Reset OTP',

//     html: `
//       <div>
//         <h2>Password Reset</h2>

//         <p>You requested to reset your password.</p>

//         <p>Your OTP is:</p>

//         <h1>${otp}</h1>

//         <p>
//           This OTP will expire in 10 minutes.
//         </p>

//         <p>
//           If you did not request a password reset,
//           you can safely ignore this email.
//         </p>
//       </div>
//     `
//   });

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// };