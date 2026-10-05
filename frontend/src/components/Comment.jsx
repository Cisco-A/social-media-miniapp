import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";

const Comment = ({ comment }) => {
  const { user } = useAuth();

  return (
    <div
      className="
                      flex gap-3 rounded-xl
                      bg-white p-3 mb-3
                    "
    >
      {comment?.author?.avatarUrl ? (
        <img
          src={comment?.author?.avatarUrl}
          alt={comment?.author?.displayName}
          className="
                      h-10 w-10 shrink-0 rounded-full object-cover
                      sm:h-11 sm:w-11
                    "
        />
      ) : (
        <p className="small-avatar">
          {comment?.author?.displayName.charAt(0).toUpperCase()}
        </p>
      )}

      <div className="min-w-0 flex-1">
        <div
          className="
                          flex items-center
                          justify-between gap-2
                        "
        >
          <h4 className="truncate text-xs font-bold">
            {comment?.author?.displayName === user?.displayName
              ? "You"
              : comment?.author?.displayName}
          </h4>

          <span className="shrink-0 text-[10px] text-gray-400 sm:text-xs">
            {dayjs(comment.createdAt).format("D MMMM YYYY H:mm A")}
          </span>
        </div>

        <p
          className="
                          mt-1 text-xs leading-5
                          text-gray-600
                        "
        >
          {comment?.content}
        </p>

        {/* <div
          className="
                          mt-2 flex gap-4
                          text-xs text-gray-500
                        "
        >
          <span>♡ 7</span>
          <button>Reply</button>
        </div> */}
      </div>
    </div>
  );
};

export default Comment;
