import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ?? fallback;

const getDisplayName = (user) => user?.displayName || user?.username || "User";

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [commentsError, setCommentsError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadPost = async () => {
      setIsLoading(true);
      setErrorMessage("");
      setCommentsError("");
      setActionError("");
      setPost(null);
      setComments([]);
      setIsLiked(false);

      try {
        const response = await api.get(`/posts/${id}`);
        const fetchedPost = response.data?.data?.post;

        if (!fetchedPost) {
          throw new Error("The post response did not include a post.");
        }

        if (isCurrent) setPost(fetchedPost);

        const [likesResult, commentsResult] = await Promise.allSettled([
          api.get(`/likes/${id}`),
          api.get(`/comments/posts/${id}`),
        ]);

        if (!isCurrent) return;

        if (likesResult.status === "fulfilled") {
          const likes = likesResult.value.data?.likes ?? [];
          const currentUserId = user?._id ?? user?.id;
          setIsLiked(
            Boolean(
              currentUserId &&
              likes.some((like) => {
                const likedUserId = like.userId?._id ?? like.userId;
                return String(likedUserId) === String(currentUserId);
              }),
            ),
          );
          setPost((currentPost) =>
            currentPost
              ? {
                  ...currentPost,
                  likesCount: fetchedPost.likesCount ?? likes.length,
                }
              : currentPost,
          );
        } else {
          setActionError(
            getErrorMessage(likesResult.reason, "Unable to load like status."),
          );
        }

        if (commentsResult.status === "fulfilled") {
          setComments(commentsResult.value.data?.data ?? []);
        } else {
          setCommentsError(
            getErrorMessage(commentsResult.reason, "Unable to load comments."),
          );
        }
      } catch (error) {
        if (isCurrent) {
          setErrorMessage(getErrorMessage(error, "Unable to load this post."));
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    loadPost();
    return () => {
      isCurrent = false;
    };
  }, [id, user?._id, user?.id]);

  async function handleLikeClick() {
    if (!post || isLikeLoading) return;

    const wasLiked = isLiked;
    const previousLikesCount = post.likesCount ?? 0;
    const nextLiked = !wasLiked;

    // Update the UI immediately, then undo it if the API request fails.
    setIsLiked(nextLiked);
    setPost((currentPost) =>
      currentPost
        ? {
            ...currentPost,
            likesCount: nextLiked
              ? previousLikesCount + 1
              : Math.max(0, previousLikesCount - 1),
          }
        : currentPost,
    );
    setIsLikeLoading(true);
    setActionError("");

    try {
      if (wasLiked) {
        await api.delete(`/likes/${id}`);
      } else {
        await api.post(`/likes/${id}`);
      }
    } catch (error) {
      setIsLiked(wasLiked);
      setPost((currentPost) =>
        currentPost
          ? { ...currentPost, likesCount: previousLikesCount }
          : currentPost,
      );
      setActionError(getErrorMessage(error, "Unable to update your like."));
    } finally {
      setIsLikeLoading(false);
    }
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();
    const content = commentText.trim();
    if (!content || isCommentLoading) return;

    setIsCommentLoading(true);
    setCommentsError("");

    try {
      const response = await api.post(`/comments/posts/${id}`, { content });
      const comment = response.data?.data;
      if (comment)
        setComments((currentComments) => [comment, ...currentComments]);
      setCommentText("");
    } catch (error) {
      setCommentsError(getErrorMessage(error, "Unable to add your comment."));
    } finally {
      setIsCommentLoading(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-10 text-center text-slate-600">
        Loading post…
      </main>
    );
  }

  if (errorMessage || !post) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-10 text-slate-800">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-red-700" role="alert">
            {errorMessage || "Post not found."}
          </p>
          <Link
            className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
            to="/posts"
          >
            ← Back to feed
          </Link>
        </div>
      </main>
    );
  }

  const author = post.author ?? {};
  const authorName = getDisplayName(author);
  const currentUserName = getDisplayName(user);

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-6 text-slate-800 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <button
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
          onClick={() => navigate("/posts")}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={16} /> Back to Feed
        </button>

        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
            {author.avatarUrl ? (
              <img
                alt=""
                className="h-11 w-11 rounded-full object-cover"
                src={author.avatarUrl}
              />
            ) : (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                {authorName.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold">{authorName}</p>
              <p className="text-xs text-slate-500">
                {author.username ? `@${author.username} · ` : ""}
                {post.createdAt
                  ? dayjs(post.createdAt).format("D MMMM YYYY, h:mm A")
                  : ""}
              </p>
            </div>
          </div>

          <p className="whitespace-pre-wrap px-4 pb-4 leading-6 sm:px-6">
            {post.content}
          </p>

          {post.images?.length > 0 ? (
            post.images.map((imageUrl, index) => (
              <img
                alt={`Post image ${index + 1}`}
                className="max-h-144 w-full bg-slate-100 object-contain"
                key={`${imageUrl}-${index}`}
                src={imageUrl}
              />
            ))
          ) : (
            <div className="mx-4 mb-4 rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-400 sm:mx-6">
              This post has no image attached.
            </div>
          )}

          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm text-slate-500 sm:px-6">
            <span className="inline-flex items-center gap-1.5">
              <Heart aria-hidden="true" className="text-rose-500" size={16} />
              {post.likesCount ?? 0}{" "}
              {(post.likesCount ?? 0) === 1 ? "like" : "likes"}
            </span>
            <span>
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 px-4 py-3 sm:px-6">
            <button
              aria-pressed={isLiked}
              className={`inline-flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors disabled:cursor-wait disabled:opacity-60 ${
                isLiked
                  ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-rose-600"
              }`}
              disabled={isLikeLoading}
              aria-busy={isLikeLoading}
              onClick={handleLikeClick}
              type="button"
            >
              <Heart
                aria-hidden="true"
                fill={isLiked ? "currentColor" : "none"}
                size={17}
              />
              {isLiked ? "Liked" : "Like"}
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => document.getElementById("comment-input")?.focus()}
              type="button"
            >
              <MessageCircle aria-hidden="true" size={17} /> Comment
            </button>
          </div>
          {actionError && (
            <p className="px-4 pb-3 text-sm text-red-600 sm:px-6" role="alert">
              {actionError}
            </p>
          )}
        </article>

        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold">Comments</h2>

          <form className="mb-5" onSubmit={handleCommentSubmit}>
            <label className="sr-only" htmlFor="comment-input">
              Write a comment
            </label>
            <div className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                {currentUserName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <textarea
                  className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  id="comment-input"
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder={`Add a comment as @${user?.username || "you"}…`}
                  rows="2"
                  value={commentText}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!commentText.trim() || isCommentLoading}
                    type="submit"
                  >
                    {isCommentLoading ? "Posting…" : "Comment"}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {commentsError && (
            <p className="mb-3 text-sm text-red-600" role="alert">
              {commentsError}
            </p>
          )}
          {comments.length === 0 && !commentsError && (
            <p className="text-sm text-slate-500">
              No comments yet. Start the conversation.
            </p>
          )}

          <div className="space-y-3">
            {comments.map((comment) => {
              const commentAuthor = comment.author ?? {};
              const commentAuthorName = getDisplayName(commentAuthor);

              return (
                <article
                  className="flex gap-3 rounded-lg bg-indigo-50/70 p-3"
                  key={comment._id}
                >
                  {commentAuthor.avatarUrl ? (
                    <img
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                      src={commentAuthor.avatarUrl}
                    />
                  ) : (
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-200 font-semibold text-indigo-800">
                      {commentAuthorName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-sm font-semibold">
                        {commentAuthorName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {commentAuthor.username
                          ? `@${commentAuthor.username} · `
                          : ""}
                        {comment.createdAt
                          ? dayjs(comment.createdAt).format(
                              "D MMMM YYYY, h:mm A",
                            )
                          : ""}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-5">
                      {comment.content}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Post;
