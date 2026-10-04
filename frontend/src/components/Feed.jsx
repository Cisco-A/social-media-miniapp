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

const Feed = ({ post, showComment }) => {
  const navigate = useNavigate();

  const [commentsCount, setCommentsCount] = useState(0);

  function goToPost() {
    navigate(`/posts/${post._id}`);
  }

  useEffect(() => {
    const getCommentsByPostId = async () => {
      const res = await api.get(`/comments/posts/${post?._id}`);
      setCommentsCount(res.data?.data.length);
    };
    getCommentsByPostId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentsCount]);

  return (
    <>
      <article
        className="
                w-full overflow-hidden rounded-xl
                bg-white shadow-sm
              "
      >
        {/* POST HEADER */}
        <div
          className="
                  flex items-start justify-between
                  gap-3 px-4 pt-5
                  sm:px-7 sm:pt-6
                "
        >
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={post.author?.avatarUrl ? post.author?.avatarUrl : null}
              alt={post.author?.displayName}
              className="
                      h-10 w-10 shrink-0 rounded-full object-cover
                      sm:h-11 sm:w-11
                    "
            />

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="truncate text-sm font-bold">
                  {post.author?.displayName}
                </h3>

                {
                  <CheckCircle2
                    size={15}
                    className="shrink-0 fill-[#5052db] text-white"
                  />
                }
              </div>

              <p className="truncate text-xs text-gray-500">
                @{post.author?.username} ·{" "}
                {dayjs(post.createdAt).format("D MMMM YYYY, h:mm A")}
              </p>
            </div>
          </div>

          <button
            onClick={goToPost}
            className="
                    shrink-0 rounded-full p-2
                    text-gray-500 hover:bg-gray-100
                  "
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* POST TEXT */}
        <div
          className="
                  px-4 pb-4 pt-4
                  sm:px-7 sm:pb-5
                "
        >
          <p
            className="
                    text-sm leading-6 text-[#1e293b]
                    sm:text-[15px]
                  "
          >
            {post.content}
          </p>
        </div>

        {/* IMAGE */}
        {post.images.length > 0 && (
          <div
            className="
                    relative mx-3 overflow-hidden rounded-xl
                    sm:mx-7
                  "
          >
            <img
              src={post.images[0] ?? null}
              alt="Post"
              className="
                      aspect-16/10 w-full object-cover
                      sm:aspect-video
                    "
            />

            {/* IMAGE LABEL */}
            {post.tag && (
              <div
                className="
                        absolute bottom-2 left-2
                        flex max-w-[calc(100%-1rem)]
                        items-center gap-1
                        rounded-full bg-white/95
                        px-2.5 py-1.5
                        text-[10px] font-medium shadow
                        sm:bottom-3 sm:left-3
                        sm:px-3 sm:py-2
                        sm:text-xs
                      "
              >
                <img
                  src={null}
                  alt=""
                  className="h-3 w-3 shrink-0 sm:h-4 sm:w-4"
                />

                <span className="truncate">{post.tag}</span>
              </div>
            )}
          </div>
        )}

        {/* ACTIONS */}
        <div
          className="
                  flex flex-wrap items-center
                  justify-between gap-3
                  px-4 py-4
                  sm:px-7 sm:py-5
                "
        >
          <div
            className="
                    flex flex-wrap items-center
                    gap-x-4 gap-y-3
                    sm:gap-5
                  "
          >
            {/* LIKE */}
            <button
              onClick={goToPost}
              className="
                      flex items-center gap-1.5
                      whitespace-nowrap
                      text-xs text-gray-600
                      hover:text-[#5052db]
                      sm:gap-2 sm:text-sm
                    "
            >
              <Heart
                size={18}
                className={post.id === 1 ? "fill-[#5052db] text-[#5052db]" : ""}
              />
              {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
            </button>

            {/* COMMENTS */}
            <button
              onClick={goToPost}
              className="
                      flex items-center gap-1.5
                      whitespace-nowrap
                      text-xs text-gray-600
                      hover:text-[#5052db]
                      sm:gap-2 sm:text-sm
                    "
            >
              <MessageCircle size={18} />
              {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
            </button>

            {/* SHARE */}
            {/* <button
              className="
                      flex items-center gap-1.5
                      whitespace-nowrap
                      text-xs text-gray-600
                      sm:gap-2 sm:text-sm
                    "
            >
              <Share2 size={17} />
              Share
            </button> */}
          </div>

          {/* BOOKMARK */}
          {/* <button
            className="
                    shrink-0 text-gray-500
                    hover:text-[#5052db]
                  "
          >
            <Bookmark size={19} />
          </button> */}
        </div>

        {/* COMMENTS */}
        {post.showComments && (
          <div className="bg-[#f0f4ff] px-4 pb-5 sm:px-7">
            {/* COMMENT HEADER */}
            <div
              className="
                      flex items-center justify-between
                      gap-3 py-4 text-xs
                    "
            >
              <button
                className="
                        truncate font-medium
                        text-[#5052db]
                      "
              >
                View all {post.comments} comments
              </button>

              <span className="shrink-0 text-gray-500">Top comment</span>
            </div>

            {/* COMMENT */}
            {showComment && <Comment />}

            {/* COMMENT INPUT */}
            {showComment && <CommentInput />}
          </div>
        )}
      </article>
    </>
  );
};

export default Feed;
