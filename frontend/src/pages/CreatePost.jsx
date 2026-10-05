import { useState, useRef } from "react";
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
  const fileInputRef = useRef(null);

  const [postText, setPostText] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [visibility, setVisibility] = useState("Public");
  const [category] = useState("Post");

  // Local state for image files and preview URLs
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Handle file selection (from file picker or drop)
  const handleImageChange = (files) => {
    const selectedFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (images.length + selectedFiles.length > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }

    const updatedImages = [...images, ...selectedFiles];
    setImages(updatedImages);

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleImageChange(e.target.files);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleImageChange(e.dataTransfer.files);
    }
  };

  const removeImage = (indexToRemove) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[indexToRemove]);

    setImages(images.filter((_, index) => index !== indexToRemove));
    setImagePreviews(
      imagePreviews.filter((_, index) => index !== indexToRemove),
    );
  };

  const handlePublishPost = async (e) => {
    e.preventDefault();
    setIsPublishing(true);

    try {
      // const response = await api.post("/posts", {
      //   content: postText,
      //   images: images, // Array of selected image files
      // });

      const formData = new FormData();
      formData.append("content", postText);
      images.forEach((img) => formData.append("images", img));

      const response = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data?.message || "Post created successfully!");
      navigate("/posts", { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to publish post.";
      toast.error(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  };

  const goBack = () => {
    navigate("/posts");
  };

  return (
    <div className="bg-[#f6f7ff] min-h-screen w-full px-4 sm:px-6 lg:px-10 py-6 font-sans relative text-slate-800">
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
            <span className="font-semibold text-slate-900">
              Create New Post
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Draft auto-saved</span>
            </div>
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
                    {user?.avatarUrl ? (
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
                      {user?.displayName}
                    </h2>
                    <div className="flex items-center gap-1 mt-0.5">
                      <button className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 hover:bg-slate-200/70 px-2 py-0.5 rounded-md font-medium transition-colors">
                        <Globe size={11} />
                        <span className="text-sm">{visibility}</span>
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

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                accept="image/*"
                multiple
                className="hidden"
              />

              {/* File Upload Drag & Drop Box */}
              {images.length < 3 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-indigo-100 hover:border-indigo-300 bg-[#f8faff] rounded-2xl p-6 text-center transition-colors cursor-pointer mb-4"
                >
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <UploadCloud size={20} />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Upload photos or drag and drop (Max 3)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    High-resolution PNG, JPG or WebP up to 15MB each
                  </p>
                </div>
              )}

              {/* Image Previews Row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {imagePreviews.map((imgSrc, idx) => (
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
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-slate-900/60 hover:bg-slate-900 text-white p-1 rounded-full backdrop-blur-sm transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {/* Add More Box (only if under limit of 3) */}
                {images.length > 0 && images.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100 mb-1">
                      <Plus size={16} />
                    </div>
                    <span className="text-xs font-medium">Add more</span>
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePublishPost}
                  disabled={isPublishing || (!postText && images.length === 0)}
                  className="px-5 py-2.5 bg-[#4748D4] hover:bg-[#3b3cb8] text-white font-medium text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center gap-2 transition-colors disabled:bg-[#3b3cb8]/40"
                >
                  {isPublishing ? (
                    <Loader className="text-white animate-spin" size={16} />
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Publish Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Preview & Sidebar Tips (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-semibold text-slate-800">
                Live Card Preview
              </span>
              <span className="text-slate-400">Feed Mock</span>
            </div>

            {/* Live Preview Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 space-y-3">
              <div className="flex items-center gap-2.5">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                    {user?.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
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

              {imagePreviews.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-slate-100">
                  <img
                    src={imagePreviews[0]}
                    alt="Main Post Preview"
                    className="w-full h-36 object-cover"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-slate-400 pt-1 text-xs">
                <button className="flex items-center gap-1 hover:text-slate-600">
                  <Heart size={14} />
                  <span className="text-[11px]">0</span>
                </button>
                <button className="flex items-center gap-1 hover:text-slate-600">
                  <MessageSquare size={14} />
                  <span className="text-[11px]">0</span>
                </button>
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
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
