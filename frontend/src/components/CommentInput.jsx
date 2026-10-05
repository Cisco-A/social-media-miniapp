import { useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CommentInput = ({ post, onCommentAdded }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  async function publishComment() {
    if (!comment.trim() || isPosting) return;

    setIsPosting(true);
    try {
      const res = await api.post(`comments/posts/${post._id}`, {
        content: comment.trim(),
      });

      // Assuming API returns { data: newComment } or similar
      const newComment = res.data?.data || {
        _id: Date.now().toString(),
        content: comment.trim(),
        author: user,
        createdAt: new Date().toISOString(),
      };

      // Notify parent component to immediately add comment to UI
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }

      setComment("");
      toast.success("Comment posted successfully");
    } catch (error) {
      console.log("Error posting comment:", error);
      toast.error("Unable to post comment");
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <div className="mt-4 flex items-center gap-2 sm:gap-3">
      {user?.avatarUrl ? (
        <img
          src={user?.avatarUrl}
          alt={user?.displayName}
          className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
        />
      ) : (
        <p className="small-avatar">
          {user?.displayName?.charAt(0).toUpperCase()}
        </p>
      )}
      <div className="flex min-w-0 flex-1 items-center rounded-full bg-white px-3 py-2 sm:px-4">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          type="text"
          placeholder="Write a comment..."
          className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-gray-400 sm:text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") publishComment();
          }}
        />

        <button
          onClick={publishComment}
          disabled={!comment.trim() || isPosting}
          className="shrink-0 rounded-full bg-[#5052db] px-3 py-1.5 text-[10px] font-medium text-white transition-colors duration-200 hover:cursor-pointer hover:bg-[#5052db]/70 disabled:bg-[#5052db]/30 sm:px-4 sm:text-xs"
        >
          {isPosting ? <Loader className="animate-spin text-white" /> : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
