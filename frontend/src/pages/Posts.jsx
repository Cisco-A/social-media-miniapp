import { Plus } from "lucide-react";
import api from "../api/axios";
import { useEffect, useState } from "react";
import Feed from "../components/Feed";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

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
  const { user } = useAuth();
  const [allPosts, setAllPosts] = useState([]);
  const navigate = useNavigate();
  const goToCreatePost = () => {
    navigate("/posts/create", { replace: true });
  };
  useEffect(() => {
    const fetchAllposts = async () => {
      const res = await api.get("/posts");
      setAllPosts(res.data?.data?.posts);
    };
    fetchAllposts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);
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
              Welcome back, {user?.displayName} 👋
            </h2>

            <p className="text-sm text-gray-500">
              Here's what your friends are sharing today
            </p>
          </div>

          <button
            onClick={goToCreatePost}
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
          {allPosts.map((post) => (
            <Feed key={post._id} post={post} comments={false} />
          ))}
        </div>

        {/* LOADING */}
        {/* <div
          className="
            flex flex-col items-center
            justify-center py-10
            sm:py-12
          "
        >
          <LoaderCircle size={22} className="animate-spin text-[#6466e8]" />

          <p className="mt-3 text-sm text-gray-600">Loading more posts...</p>

          <p
            className="
              mt-3 flex items-center gap-1
              text-center text-xs text-gray-500
            "
          >
            <CheckCircle2 size={14} className="shrink-0 text-cyan-600" />
            You're all caught up for now
          </p>
        </div> */}
      </main>
    </div>
  );
};

export default Posts;
