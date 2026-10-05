import {
  CheckCircle2,
  Heart,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import Comment from "../components/Comment";
import CommentInput from "./CommentInput";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Feed = ({ post, comments }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [commentsCount, setCommentsCount] = useState(0);
  const [allComments, setAllComments] = useState([]);

  function goToPost() {
    navigate(`/posts/${post._id}`);
  }

  async function toggleLike() {
    setLiked(!liked);
    try {
      if (liked) {
        setLikesCount((prev) => prev - 1);
        await api.delete(`/likes/${post._id}`);
      } else {
        setLikesCount((prev) => prev + 1);
        await api.post(`/likes/${post._id}`);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
      toast.error("Unable to like the post");
    }
  }

  useEffect(() => {
    async function fetchLike() {
      try {
        const res = await api.get(`/likes/${post._id}`);
        const userLikes = res.data?.likes.filter(
          (like) => like.postId === post._id && like.userId._id === user._id,
        );
        setLiked(Boolean(userLikes && userLikes.length > 0));
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    }
    if (user?._id && post?._id) {
      fetchLike();
    }
  }, [post._id, user?._id]);

  useEffect(() => {
    const getCommentsByPostId = async () => {
      try {
        const res = await api.get(`/comments/posts/${post?._id}`);
        const fetchedComments = res.data?.data || [];
        setAllComments(fetchedComments);
        setCommentsCount(fetchedComments.length);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    if (post?._id) {
      getCommentsByPostId();
    }
  }, [post._id]);

  // Handler to instantly update comments state when a new comment is posted
  const handleCommentAdded = (newComment) => {
    setAllComments((prevComments) => [newComment, ...prevComments]);
    setCommentsCount((prevCount) => prevCount + 1);
  };

  return (
    <article className="w-full overflow-hidden rounded-xl bg-white shadow-sm">
      {/* POST HEADER */}
      <div className="flex items-start justify-between gap-3 px-4 pt-5 sm:px-7 sm:pt-6">
        <div
          className="flex min-w-0 items-center gap-3 hover:cursor-pointer"
          onClick={goToPost}
        >
          {post.author?.avatarUrl ? (
            <img
              src={post.author?.avatarUrl}
              alt={post.author?.displayName}
              className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
            />
          ) : (
            <p className="small-avatar">
              {post.author?.displayName?.charAt(0).toUpperCase()}
            </p>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="truncate text-sm font-bold">
                {post.author?.displayName}
              </h3>
              <CheckCircle2
                size={15}
                className="shrink-0 fill-[#5052db] text-white"
              />
            </div>

            <p className="truncate text-xs text-gray-500">
              @{post.author?.username} ·{" "}
              {dayjs(post.createdAt).format("D MMMM YYYY, h:mm A")}
            </p>
          </div>
        </div>

        <button
          onClick={goToPost}
          className="shrink-0 rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* POST TEXT */}
      <div className="px-4 pb-4 pt-4 sm:px-7 sm:pb-5">
        <p className="text-sm leading-6 text-[#1e293b] sm:text-[15px]">
          {post.content}
        </p>
      </div>

      {/* IMAGE */}
      {post.images?.length > 0 && (
        <div className="relative mx-3 overflow-hidden rounded-xl sm:mx-7">
          <img
            src={post.images[0] ?? null}
            alt="Post"
            className="aspect-16/10 w-full object-cover sm:aspect-video"
          />

          {post.tag && (
            <div className="absolute bottom-2 left-2 flex max-w-[calc(100%-1rem)] items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-medium shadow sm:bottom-3 sm:left-3 sm:px-3 sm:py-2 sm:text-xs">
              <span className="truncate">{post.tag}</span>
            </div>
          )}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-7 sm:py-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-5">
          {/* LIKE */}
          <button
            onClick={toggleLike}
            className="flex items-center gap-1.5 whitespace-nowrap text-xs text-gray-600 hover:cursor-pointer hover:text-[#5052db] sm:gap-2 sm:text-sm"
          >
            <Heart
              size={18}
              className={liked ? "fill-red-500 text-red-500" : ""}
            />
            {likesCount} {likesCount === 1 ? "like" : "likes"}
          </button>

          {/* COMMENTS */}
          <button className="flex items-center gap-1.5 whitespace-nowrap text-xs text-gray-600 hover:text-[#5052db] sm:gap-2 sm:text-sm">
            <MessageCircle size={18} />
            {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
          </button>
        </div>
      </div>

      {/* COMMENTS SECTION */}
      {comments && (
        <div className="bg-[#f0f4ff] px-4 pb-5 sm:px-7">
          <div className="flex items-center justify-between gap-3 py-4 text-xs">
            <button
              onClick={goToPost}
              className="truncate font-medium text-[#5052db] transition-all duration-300 hover:cursor-pointer hover:text-[#5052db]/70"
            >
              {commentsCount
                ? `View ${commentsCount <= 1 ? "" : "all"} ${commentsCount} ${
                    commentsCount === 1 ? "comment" : "comments"
                  }`
                : null}
            </button>
          </div>

          {allComments.map((comment, index) => (
            <Comment key={comment._id || index} comment={comment} />
          ))}

          {/* PASS THE CALLBACK TO COMMENTINPUT */}
          <CommentInput post={post} onCommentAdded={handleCommentAdded} />
        </div>
      )}
    </article>
  );
};

export default Feed;
