
// const createLikeService = async (userId, postId) => {
//   const like = new Like({
//     userId,
//     postId
//   });

//   return like.save();
// };

// const getLikesByPostId = async (postId) => {
//   return Like.find({ postId })
//     .populate('userId', '_id');
// };

// const getLikesCountByPostId = async (postId) => {
//   return Like.countDocuments({ postId });
// };

// const unlikePostService = async (userId, postId) => {
//   return Like.findOneAndDelete({
//     userId,
//     postId
//   });
// };

// export {
//   createLikeService,
//   getLikesByPostId,
//   getLikesCountByPostId,
//  unlikePostService
// };