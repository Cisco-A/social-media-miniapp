// import {
//   createLikeService,
//   getLikesByPostId,
//   getLikesCountByPostId,
//  unlikePostService
// } from './likes.service.js';

// const createLike = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { postId } = req.params;

//     const like = await createLikeService(
//       userId,
//       postId
//     );

//     res.status(201).json({
//       status: true,
//       message: 'Post liked successfully',
//       like
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: 'Failed to like the post'
//     });
//   }
// };

// const getLikes = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const likes = await getLikesByPostId(postId);

//     res.status(200).json({
//       status: true,
//       message: 'Likes retrieved successfully',
//       likes
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: false,
//       message: 'Failed to get all likes'
//     });
//   }
// };

// const getLikesCount = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const count = await getLikesCountByPostId(postId);

//     res.status(200).json({
//       status: true,
//       message: 'Likes count retrieved successfully',
//       count
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: false,
//       message: 'Failed to get likes count'
//     });
//   }
// };

// const unlikePost = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { postId } = req.params;

//     const like = await unlikePostService(
//       userId,
//       postId
//     );

//     if (!like) {
//       return res.status(404).json({
//         status: false,
//         message: 'Like not found'
//       });
//     }

//     res.status(200).json({
//       status: true,
//       message: 'Post unliked successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: 'Failed to unlike the post'
//     });
//   }
// };

// export {
//   createLike,
//   getLikes,
//   getLikesCount,
//    unlikePost
// };