import mongoose from 'mongoose';
const { Schema } = mongoose;

const otpSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },

    purpose: { 
        type: String,
        enum: ['resetPassword', 'emailVerification'],
        required: true
    },

    codeHash: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600 // OTP expires after 10 minutes
    }


}   
)

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;