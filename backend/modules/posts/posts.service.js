import mongoose from "mongoose";
import Post from "./posts.schema.js";
import cloudinary from "../../config/cloudinary.js";


const uploadPostImages = (fileBuffers = []) => {
	const uploads = fileBuffers.map(
		(buffer) =>
			new Promise((resolve, reject) => {
				const stream = cloudinary.uploader.upload_stream(
					{ folder: "mingle/posts", resource_type: "image" },
					(error, result) => {
						if (error) return reject(error);
						if (!result?.secure_url)
							return reject(new Error("Cloudinary did not return an image URL"));
						resolve(result.secure_url);
					},
				);
				stream.end(buffer);
			}),
	);
	return Promise.all(uploads);
};

const authorFields = "username displayName avatarUrl";

const invalidIdResult = () => ({
	code: 400,
	error: "Invalid post ID",
});

const getEditableFields = (data = {}) => {
	const fields = {};

	if (Object.hasOwn(data, "content")) {
		fields.content = data.content;
	}

	if (Object.hasOwn(data, "images")) {
		fields.images = data.images;
	}

	return fields;
};

const validationErrorResult = (error) => ({
	code: 400,
	error: error.message,
});

const isValidationError = (error) =>
	error.name === "ValidationError" || error.name === "CastError";

const parsePositiveInteger = (value, fallback, maximum = Number.MAX_SAFE_INTEGER) => {
	const parsed = Number(value);

	if (!Number.isInteger(parsed) || parsed < 1) {
		return fallback;
	}

	return Math.min(parsed, maximum);
};

const createPostService = async (authorId, data = {}) => {
	try {
		const post = await Post.create({
			author: authorId,
			...getEditableFields(data),
		});

		await post.populate("author", authorFields);

		return {
			code: 201,
			successMessage: "Post created successfully",
			post,
		};
	} catch (error) {
		if (isValidationError(error)) {
			return validationErrorResult(error);
		}

		throw error;
	}
};

const getPostsService = async (query = {}) => {
	const page = parsePositiveInteger(query.page, 1);
	const limit = parsePositiveInteger(query.limit, 20, 100);
	const skip = (page - 1) * limit;

	const [posts, totalPosts] = await Promise.all([
		Post.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate("author", authorFields)
			.populate({ path: "comments", populate: { path: "author", select: authorFields } }),
		Post.countDocuments(),
	]);

	return {
		code: 200,
		successMessage: "Posts retrieved successfully",
		posts,
		pagination: {
			page,
			limit,
			totalPosts,
			totalPages: Math.ceil(totalPosts / limit),
		},
	};
};

const getMyPostsService = async (authorId, query = {}) => {
	const page = parsePositiveInteger(query.page, 1);
	const limit = parsePositiveInteger(query.limit, 12, 100);
	const skip = (page - 1) * limit;
	const filter = { author: authorId };

	const [posts, totalPosts] = await Promise.all([
		Post.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate("author", authorFields)
			.populate({ path: "comments", populate: { path: "author", select: authorFields } }),
		Post.countDocuments(filter),
	]);

	return {
		code: 200,
		successMessage: "Your posts retrieved successfully",
		posts,
		pagination: {
			page,
			limit,
			totalPosts,
			totalPages: Math.ceil(totalPosts / limit),
		},
	};
};

const getPostByIdService = async (postId) => {
	if (!mongoose.isValidObjectId(postId)) {
		return invalidIdResult();
	}

	const post = await Post.findById(postId)
		.populate("author", authorFields)
		.populate({ path: "comments", populate: { path: "author", select: authorFields } });

	if (!post) {
		return {
			code: 404,
			error: "Post not found",
		};
	}

	return {
		code: 200,
		successMessage: "Post retrieved successfully",
		post,
	};
};

const updatePostService = async (authorId, postId, data = {}) => {
	if (!mongoose.isValidObjectId(postId)) {
		return invalidIdResult();
	}

	const updates = getEditableFields(data);

	if (Object.keys(updates).length === 0) {
		return {
			code: 400,
			error: "Provide content or images to update",
		};
	}

	try {
		const post = await Post.findOneAndUpdate(
			{ _id: postId, author: authorId },
			{ $set: updates },
			{ returnDocument: "after", runValidators: true },
		).populate("author", authorFields);

		if (!post) {
			return {
				code: 404,
				error: "Post not found or you do not have permission to update it",
			};
		}

		return {
			code: 200,
			successMessage: "Post updated successfully",
			post,
		};
	} catch (error) {
		if (isValidationError(error)) {
			return validationErrorResult(error);
		}

		throw error;
	}
};

const deletePostService = async (authorId, postId) => {
	if (!mongoose.isValidObjectId(postId)) {
		return invalidIdResult();
	}

	const post = await Post.findOneAndDelete({ _id: postId, author: authorId });

	if (!post) {
		return {
			code: 404,
			error: "Post not found or you do not have permission to delete it",
		};
	}

	return {
		code: 200,
		successMessage: "Post deleted successfully",
		post,
	};
};

export {
	uploadPostImages,
	createPostService,
	getPostsService,
	getMyPostsService,
	getPostByIdService,
	updatePostService,
	deletePostService,
};
