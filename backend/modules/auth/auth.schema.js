import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

      displayName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    username: {
      type: String,
      default: ''
    },

    passwordHash: {
      type: String,
      required: true
    },

    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true
    },

    bio: {
      type: String,
      default: ''
    },

    avatarUrl: {
      type: String,
      default: ''
    },

    emailVerified: {
      type: Boolean,
      default: false
    },

    // resetPasswordOtp: {
    //   type: String,
    //   default: null
    // },

    // resetPasswordOtpExpires: {
    //   type: Date,
    //   default: null
    // },

    // resetPasswordOtpAttempts: {
    //   type: Number,
    //   default: 0
    // }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;