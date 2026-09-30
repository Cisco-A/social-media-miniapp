import { useState } from "react";
import { useParams } from "react-router";
import mingleLogo from "../assets/mingle-logo.svg";

const samplePost = {
  author: "Alex Morgan",
  username: "alexmorgan",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces",
  postedAt: "1 day ago",
  text: "Exploring the quiet coastlines this afternoon. The ocean breeze clears the mind like nothing else! 🌊🌤️",
  image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1400",
  imageAlt: "Ocean waves along a quiet coastline",
  location: "Big Sur, California",
  likes: 328,
  comments: 24,
  shares: 12,
};

const startingComments = [
  {
    id: 1,
    name: "Elena Rostova",
    username: "erostova",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=faces",
    age: "18h ago",
    text: "The clarity in that wave crest is magnificent, Alex! What lens setup did you end up bringing out to Big Sur?",
    likes: 14,
  },
  {
    id: 2,
    name: "Marcus Chen",
    username: "mchen",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces",
    age: "14h ago",
    text: "Salt air does wonders for cognitive fatigue. Looks like you caught the exact pocket before the marine fog rolled in.",
    likes: 8,
  },
  {
    id: 3,
    name: "Sophia Vance",
    username: "svance",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces",
    age: "9h ago",
    text: "This looks like a peaceful dream. Truly needed to see this color palette today.",
    likes: 5,
  },
];

function Post() {
  const { id } = useParams();

  const [liked, setLiked] = useState(true);
  const [likeCount, setLikeCount] = useState(samplePost.likes);
  const [comments, setComments] = useState(startingComments);
  const [commentText, setCommentText] = useState("");

  function handleLike() {
    const change = liked ? -1 : 1;
    setLiked(!liked);
    setLikeCount((currentCount) => currentCount + change);
  }

  function handleCommentSubmit(event) {
    event.preventDefault();

    const trimmedComment = commentText.trim();
    if (!trimmedComment) return;

    const newComment = {
      id: Date.now(),
      name: "You",
      username: "you",
      avatar: "",
      age: "Just now",
      text: trimmedComment,
      likes: 0,
    };

    setComments((currentComments) => [newComment, ...currentComments]);
    setCommentText("");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="/" aria-label="Mingle home">
            <img className="h-9 w-auto" src={mingleLogo} alt="Mingle" />
          </a>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 sm:flex">
            <span>Feed</span>
            <span>Create Post</span>
            <span>Profile</span>
          </nav>

          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="hidden sm:inline">Alex Morgan</span>
            <img
              className="h-9 w-9 rounded-full object-cover"
              src={samplePost.avatar}
              alt=""
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        <button
          className="mb-4 text-sm font-medium text-slate-600 hover:text-indigo-600"
          type="button"
        >
          ← Back to Feed
        </button>

        <article
          aria-label={`Post ${id}`}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <img
                className="h-11 w-11 rounded-full object-cover"
                src={samplePost.avatar}
                alt=""
              />
              <div>
                <p className="font-semibold">
                  {samplePost.author}
                  <span className="ml-2 text-xs font-normal text-indigo-600">
                    ✓ You
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  @{samplePost.username} · {samplePost.postedAt} · 🌐
                </p>
              </div>
            </div>

            <span className="text-xs text-slate-500">Author View</span>
          </div>

          <p className="px-4 pb-4 leading-6 sm:px-6">{samplePost.text}</p>

          <img
            className="max-h-[560px] w-full bg-slate-100 object-cover"
            src={samplePost.image}
            alt={samplePost.imageAlt}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 text-sm text-slate-500 sm:px-6">
            <span>📍 {samplePost.location}</span>
            <span>
              ❤️ {likeCount} · 💬{" "}
              {samplePost.comments + comments.length - startingComments.length}{" "}
              · ↗ {samplePost.shares}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 px-4 py-3 sm:px-6">
            <button
              className={`rounded-lg py-2 text-sm font-medium ${
                liked
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={handleLike}
              type="button"
            >
              {liked ? "♥ Liked" : "♡ Like"}
            </button>

            <button
              className="rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => document.getElementById("comment-input")?.focus()}
              type="button"
            >
              💬 Comment
            </button>

            <button
              className="rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              type="button"
            >
              ↗ Share
            </button>
          </div>
        </article>

        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Comments{" "}
              <span className="text-sm text-slate-500">
                ({comments.length})
              </span>
            </h2>
            <button
              className="text-sm text-slate-500 hover:text-indigo-600"
              type="button"
            >
              Sort by: <span className="font-medium text-indigo-600">Top⌄</span>
            </button>
          </div>

          <form onSubmit={handleCommentSubmit} className="mb-5">
            <label className="sr-only" htmlFor="comment-input">
              Write a comment
            </label>
            <div className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                Y
              </div>
              <div className="min-w-0 flex-1">
                <textarea
                  id="comment-input"
                  className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder={`Add a thoughtful reply as @you...`}
                  rows="2"
                  value={commentText}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!commentText.trim()}
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </form>

          <div className="space-y-3">
            {comments.map((comment) => (
              <article
                className="flex gap-3 rounded-lg bg-indigo-50/70 p-3"
                key={comment.id}
              >
                {comment.avatar ? (
                  <img
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                    src={comment.avatar}
                    alt=""
                  />
                ) : (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-200 font-semibold text-indigo-800">
                    Y
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-sm font-semibold">
                      {comment.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      @{comment.username} · {comment.age}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-5">{comment.text}</p>
                  <button
                    className="mt-2 text-xs text-slate-500 hover:text-indigo-600"
                    type="button"
                  >
                    ♡ {comment.likes} · Reply
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="flex flex-wrap justify-between gap-2 py-6 text-xs text-slate-500">
          <span>
            <strong className="text-indigo-600">Mingle</strong> — Simple, calm
            social interactions.
          </span>
          <span>© 2026 Mingle Inc. All rights reserved.</span>
        </footer>
      </main>
    </div>
  );
}

export default Post;
