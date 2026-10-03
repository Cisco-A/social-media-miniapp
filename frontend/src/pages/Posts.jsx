
import React from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  CheckCircle2,
  Plus,
  LoaderCircle,
} from "lucide-react";
import Paint from "../assets/paint.svg";

const posts = [
  {
    id: 1,
    displayName: "Sarah Chen",
    username: "@sarahc",
    time: "2 hours ago",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    verified: true,
    text: "Just wrapped up our weekend design sprint! Really proud of what the team built. 🚀✨",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
    tag: "Design Sprint V2 • 8 screens",
    likes: 142,
    comments: 18,
    showComments: true,
  },
  {
    id: 2,
    displayName: "David K.",
    username: "@davidk",
    time: "5 hours ago",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    verified: false,
    text: "“Simplicity in UI design is not the absence of clutter; it’s the presence of purpose. What do you think?”",
    likes: 89,
    comments: 4,
    showComments: false,
  },
];

const Posts = () => {
  return (
    <div className="min-h-screen w-full bg-[#f7f8fc] text-[#17213a]">

      {/* MAIN */}
      <main className="mx-auto w-full max-w-250 px-3 py-5 sm:px-5 sm:py-8">

        {/* WELCOME CARD */}
        <section
          className="
            mb-5 flex flex-col gap-5 rounded-xl bg-white
            px-4 py-5 shadow-sm
            sm:mb-7 sm:flex-row sm:items-center sm:justify-between
            sm:px-7 sm:py-6
          "
        >
          <div className="min-w-0">
            <h2
              className="
                mb-2 text-lg font-bold
                sm:text-xl
              "
            >
              Welcome back, Alex Morgan 👋
            </h2>

            <p className="text-sm text-gray-500">
              Here's what your friends are sharing today
            </p>
          </div>

          <button
            className="
              flex w-full items-center justify-center gap-2
              rounded-lg bg-[#5052db]
              px-4 py-3 text-sm font-medium text-white
              transition hover:bg-[#4143c8]
              sm:w-auto sm:shrink-0
            "
          >
            <Plus size={18} />
            Create Post
          </button>
        </section>

        {/* POSTS */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6">

          {posts.map((post) => (
            <article
              key={post.id}
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
                    src={post.avatar}
                    alt={post.displayName}
                    className="
                      h-10 w-10 shrink-0 rounded-full object-cover
                      sm:h-11 sm:w-11
                    "
                  />

                  <div className="min-w-0">

                    <div className="flex items-center gap-1">
                      <h3 className="truncate text-sm font-bold">
                        {post.displayName}
                      </h3>

                      {post.verified && (
                        <CheckCircle2
                          size={15}
                          className="shrink-0 fill-[#5052db] text-white"
                        />
                      )}
                    </div>

                    <p className="truncate text-xs text-gray-500">
                      {post.username} · {post.time}
                    </p>

                  </div>
                </div>

                <button
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
                  {post.text}
                </p>
              </div>

              {/* IMAGE */}
              {post.image && (
                <div
                  className="
                    relative mx-3 overflow-hidden rounded-xl
                    sm:mx-7
                  "
                >
                  <img
                    src={post.image}
                    alt="Post"
                    className="
                      aspect-[16/10] w-full object-cover
                      sm:aspect-[16/9]
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
                        src={Paint}
                        alt=""
                        className="h-3 w-3 shrink-0 sm:h-4 sm:w-4"
                      />

                      <span className="truncate">
                        {post.tag}
                      </span>
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
                      className={
                        post.id === 1
                          ? "fill-[#5052db] text-[#5052db]"
                          : ""
                      }
                    />

                    {post.likes} likes
                  </button>

                  {/* COMMENTS */}
                  <button
                    className="
                      flex items-center gap-1.5
                      whitespace-nowrap
                      text-xs text-gray-600
                      hover:text-[#5052db]
                      sm:gap-2 sm:text-sm
                    "
                  >
                    <MessageCircle size={18} />

                    {post.id === 1
                      ? `${post.comments} comments`
                      : `${post.comments} comments`}
                  </button>

                  {/* SHARE */}
                  <button
                    className="
                      flex items-center gap-1.5
                      whitespace-nowrap
                      text-xs text-gray-600
                      sm:gap-2 sm:text-sm
                    "
                  >
                    <Share2 size={17} />
                    Share
                  </button>
                </div>

                {/* BOOKMARK */}
                <button
                  className="
                    shrink-0 text-gray-500
                    hover:text-[#5052db]
                  "
                >
                  <Bookmark size={19} />
                </button>
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

                    <span className="shrink-0 text-gray-500">
                      Top comment
                    </span>
                  </div>

                  {/* COMMENT */}
                  <div
                    className="
                      flex gap-3 rounded-xl
                      bg-white p-3
                    "
                  >
                    <img
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80"
                      alt="Marcus Vance"
                      className="
                        h-8 w-8 shrink-0
                        rounded-full object-cover
                        sm:h-9 sm:w-9
                      "
                    />

                    <div className="min-w-0 flex-1">

                      <div
                        className="
                          flex items-center
                          justify-between gap-2
                        "
                      >
                        <h4 className="truncate text-xs font-bold">
                          Marcus Vance
                        </h4>

                        <span className="shrink-0 text-[10px] text-gray-400 sm:text-xs">
                          45m ago
                        </span>
                      </div>

                      <p
                        className="
                          mt-1 text-xs leading-5
                          text-gray-600
                        "
                      >
                        Looks amazing! Especially loving the spacing and
                        hierarchy on that center module. 🙌
                      </p>

                      <div
                        className="
                          mt-2 flex gap-4
                          text-xs text-gray-500
                        "
                      >
                        <span>♡ 7</span>
                        <button>Reply</button>
                      </div>

                    </div>
                  </div>

                  {/* COMMENT INPUT */}
                  <div
                    className="
                      mt-4 flex items-center gap-2
                      sm:gap-3
                    "
                  >
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      alt="You"
                      className="
                        h-8 w-8 shrink-0
                        rounded-full object-cover
                        sm:h-9 sm:w-9
                      "
                    />

                    <div
                      className="
                        flex min-w-0 flex-1
                        items-center rounded-full
                        bg-white px-3 py-2
                        sm:px-4
                      "
                    >
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        className="
                          min-w-0 flex-1
                          bg-transparent
                          text-xs outline-none
                          placeholder:text-gray-400
                          sm:text-sm
                        "
                      />

                      <button
                        className="
                          shrink-0 rounded-full
                          bg-[#5052db]
                          px-3 py-1.5
                          text-[10px] font-medium
                          text-white
                          sm:px-4 sm:text-xs
                        "
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* LOADING */}
        <div
          className="
            flex flex-col items-center
            justify-center py-10
            sm:py-12
          "
        >
          <LoaderCircle
            size={22}
            className="animate-spin text-[#6466e8]"
          />

          <p className="mt-3 text-sm text-gray-600">
            Loading more posts...
          </p>

          <p
            className="
              mt-3 flex items-center gap-1
              text-center text-xs text-gray-500
            "
          >
            <CheckCircle2
              size={14}
              className="shrink-0 text-cyan-600"
            />

            You're all caught up for now
          </p>
        </div>
      </main>
    </div>
  );
};

export default Posts;
