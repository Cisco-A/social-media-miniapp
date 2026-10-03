import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  Globe,
  UploadCloud,
  X,
  Plus,
  Send,
  CheckCircle2,
  Sparkles,
  Heart,
  MessageSquare,
  Loader,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const CreatePostPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [postText, setPostText] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [visibility, setVisibility] = useState("Public");
  const [category] = useState("Post");

  // Sample uploaded images matching the screenshot preview
  const [images, setImages] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishPost = async (e) => {
    e.preventDefault();
    setIsPublishing(true);
    try {
      const response = await api.post("/posts", {
        content: postText,
      });
      toast.success(response.data.message);
      navigate("/posts", { replace: true });
    } catch (error) {
      const errorMessage = error.response.data?.message;
      toast.error(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  };

  const goBack = () => {
    navigate("/posts");
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="bg-[#f6f7ff] min-h-screen w-full px-4 sm:px-6 lg:px-10 py-6 font-sans relative text-slate-800">
      {/* Top Right Toast Notification */}

      <div className="max-w-6xl mx-auto space-y-4">
        {/* Top Header Bar / Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={goBack}
              type="button"
              className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-600 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            {/* <span className="text-slate-500 font-medium">Feed</span>
            <span className="text-slate-300">&gt;</span> */}
            <span className="font-semibold text-slate-900">
              Create New Post
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Draft auto-saved</span>
            </div>
            {/* <button className="px-3 py-1.5 bg-slate-200/70 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors">
              View Drafts (2)
            </button> */}
          </div>
        </div>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Editor (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80">
              {/* Author & Visibility Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={`${user.displayName} display image`}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300"
                      />
                    ) : (
                      <span className="small-avatar">
                        {user?.displayName?.charAt(0).toUpperCase() || ""}
                      </span>
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-indigo-600 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900 text-sm">
                      {user.displayName}
                    </h2>
                    <div className="flex items-center gap-1 mt-0.5">
                      <button className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 hover:bg-slate-200/70 px-2 py-0.5 rounded-md font-medium transition-colors">
                        <Globe size={11} />
                        <span className="text-sm">{visibility}</span>
                        {/* <span className="text-[9px]">▼</span> */}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-medium text-xs rounded-full">
                  {category}
                </span>
              </div>

              {/* Text Input */}
              <div className="mb-6">
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={3}
                  className="w-full text-slate-800 text-sm placeholder-slate-400 border border-slate-300 py-2 px-2 rounded-xl outline-none resize-none leading-relaxed"
                />
              </div>

              {/* File Upload Drag & Drop Box */}
              <div className="border-2 border-dashed border-indigo-100 hover:border-indigo-300 bg-[#f8faff] rounded-2xl p-6 text-center transition-colors cursor-pointer mb-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <UploadCloud size={20} />
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Upload photos or drag and drop
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  High-resolution PNG, JPG or WebP up to 15MB each
                </p>
              </div>

              {/* Image Previews Row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {images.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden h-32 bg-slate-100 border border-slate-100"
                  >
                    <img
                      src={imgSrc}
                      alt={`Upload preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-slate-900/60 hover:bg-slate-900 text-white p-1 rounded-full backdrop-blur-sm transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {/* Add More Box */}
                <button className="h-32 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                  <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100 mb-1">
                    <Plus size={16} />
                  </div>
                  <span className="text-xs font-medium">Add more</span>
                </button>
              </div>

              {/* Toolbar & Character Count */}
              {/* <div className="flex items-center justify-between pt-3 border-t border-slate-100 mb-6">
                <div className="flex items-center gap-1 sm:gap-2 text-slate-500">
                  <button className="p-2 hover:bg-slate-100 rounded-lg hover:text-indigo-600 transition-colors">
                    <ImageIcon size={18} />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg hover:text-indigo-600 transition-colors">
                    <Smile size={18} />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg hover:text-indigo-600 transition-colors">
                    <BarChart2 size={18} />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg hover:text-indigo-600 transition-colors">
                    <AtSign size={18} />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg hover:text-indigo-600 transition-colors">
                    <MapPin size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                  <span>{postText.length} / 500</span>
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                {/* <div className="flex items-center gap-3">
                  <button className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                    Save as Draft
                  </button>
                </div> */}

                <button
                  onClick={handlePublishPost}
                  disabled={isPublishing || !postText}
                  className="px-5 py-2.5 bg-[#4748D4] hover:bg-[#3b3cb8] text-white font-medium text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center gap-2 transition-colors disabled:bg-[#3b3cb8]/40"
                >
                  {isPublishing ? (
                    <Loader className="text-white animate-spin" />
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Publish Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Schedule Publication Card */}
            {/* <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    Schedule publication
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Distribute at optimal engagement hours
                  </p>
                </div>
              </div>

              <button className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors">
                Set time
              </button>
            </div> */}
          </div>

          {/* Right Column: Live Preview & Sidebar Tips (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Live Card Preview Header */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-semibold text-slate-800">
                Live Card Preview
              </span>
              <span className="text-slate-400">Feed Mock</span>
            </div>

            {/* Live Preview Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Alex Morgan"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 leading-tight">
                    {user?.displayName}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Just now · Public
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                {postText || "Your post content will appear here..."}
              </p>

              {images.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-slate-100">
                  <img
                    src={images[0]}
                    alt="Main Post Preview"
                    className="w-full h-36 object-cover"
                  />
                </div>
              )}

              {/* Feed Card Action Icons */}
              <div className="flex items-center justify-between text-slate-400 pt-1 text-xs">
                <button className="flex items-center gap-1 hover:text-slate-600">
                  <Heart size={14} />
                  <span className="text-[11px]">0</span>
                </button>
                <button className="flex items-center gap-1 hover:text-slate-600">
                  <MessageSquare size={14} />
                  <span className="text-[11px]">0</span>
                </button>
                {/* <button className="flex items-center gap-1 hover:text-slate-600">
                  <Share2 size={14} />
                  <span className="text-[11px]">0</span>
                </button> */}
              </div>
            </div>

            {/* Posting Tips Module */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80 space-y-3">
              <div className="flex items-center gap-1.5 text-indigo-600 font-semibold text-xs">
                <Sparkles size={16} />
                <span>Posting Tips</span>
              </div>

              <ul className="space-y-2.5 text-[11px] text-slate-600 leading-normal">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-slate-400 shrink-0 mt-0.5"
                  />
                  <span>
                    Keep your opening sentence concise to grab attention in the
                    feed.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-slate-400 shrink-0 mt-0.5"
                  />
                  <span>
                    Images with warm, natural daylight see 38% more comment
                    replies.
                  </span>
                </li>
                {/* <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-slate-400 shrink-0 mt-0.5"
                  />
                  <span>
                    Tag collaborators or ask an open question to spur
                    discussions.
                  </span>
                </li> */}
              </ul>
            </div>

            {/* Need Inspiration Promo Card */}
            {/* <div className="bg-[#eef2ff] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-indigo-950">
                  Need inspiration?
                </h4>
                <p className="text-[11px] text-indigo-600 mt-0.5">
                  Explore top creator trends
                </p>
              </div>
              <div className="p-2 bg-white/80 text-indigo-600 rounded-xl shadow-xs">
                <Sparkles size={16} />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
