// import mongoose from 'mongoose';

// const likesSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },

//     postId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Post',
//       required: true
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// // Prevent the same user from liking the same post twice
// likesSchema.index(
//   { userId: 1, postId: 1 },
//   { unique: true }
// );

// const Like = mongoose.model('Like', likesSchema);

// export default Like;
