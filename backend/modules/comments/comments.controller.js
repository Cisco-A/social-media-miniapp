import * as commentService from "./comments.service.js";

const getAuthorId = (req) => req.user?.userId ?? req.user?.id ?? req.user?._id;

const sendError = (res, error) => {
	const status = error.message.includes("Comment not found") ? 404 : 500;

	return res.status(status).json({
		success: false,
		message: error.message,
	});
};

export const getCommentsByPost = async (req, res) => {
	try {
		const comments = await commentService.getCommentsByPost(req.params.postId);

		return res.status(200).json({
			success: true,
			message: "Comments fetched successfully",
			data: comments,
		});
	} catch (error) {
		return sendError(res, error);
	}
};

export const createComment = async (req, res) => {
	const authorId = getAuthorId(req);
	if (!authorId) {
		return res.status(401).json({ success: false, message: "Authentication required" });
	}

	try {
		const comment = await commentService.createComment({
			postId: req.params.postId ?? req.body.postId,
			authorId,
			content: req.body.content,
		});

		return res.status(201).json({
			success: true,
			message: "Comment created successfully",
			data: comment,
		});
	} catch (error) {
		return sendError(res, error);
	}
};

export const updateComment = async (req, res) => {
	const authorId = getAuthorId(req);
	if (!authorId) {
		return res.status(401).json({ success: false, message: "Authentication required" });
	}

	try {
		const comment = await commentService.updateComment(
			req.params.commentId,
			authorId,
			req.body.content
		);

		return res.status(200).json({
			success: true,
			message: "Comment updated successfully",
			data: comment,
		});
	} catch (error) {
		return sendError(res, error);
	}
};

export const deleteComment = async (req, res) => {
	const authorId = getAuthorId(req);
	if (!authorId) {
		return res.status(401).json({ success: false, message: "Authentication required" });
	}

	try {
		const comment = await commentService.deleteComment(req.params.commentId, authorId);

		return res.status(200).json({
			success: true,
			message: "Comment deleted successfully",
			data: comment,
		});
	} catch (error) {
		return sendError(res, error);
	}
};
