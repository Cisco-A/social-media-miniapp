import Comment from "./comments.schema.js";

export const getCommentsByPost = async (postId) => {
	return Comment.find({ post: postId })
		.populate("author", "username displayName avatarUrl")
		.sort({ createdAt: -1 });
};

export const createComment = async ({ postId, authorId, content }) => {
	const comment = await Comment.create({
		post: postId,
		author: authorId,
		content,
	});

	return comment.populate("author", "username displayName avatarUrl");
};

export const updateComment = async (commentId, authorId, content) => {
	const comment = await Comment.findOneAndUpdate(
		{ _id: commentId, author: authorId },
		{ $set: { content } },
		{ new: true, runValidators: true }
	).populate("author", "username displayName avatarUrl");

	if (!comment) {
		throw new Error("Comment not found or you are not authorized to update it");
	}

	return comment;
};

export const deleteComment = async (commentId, authorId) => {
	const comment = await Comment.findOneAndDelete({
		_id: commentId,
		author: authorId,
	});

	if (!comment) {
		throw new Error("Comment not found or you are not authorized to delete it");
	}

	return comment;
};
