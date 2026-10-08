import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const startingProfile = {
  name: "Alex Morgan",
  username: "alexmorgan",
  bio: "Product designer and photographer based in San Francisco. Building simple tools for curious minds ✨",
  avatarUrl: "",
};

const POSTS_PER_PAGE = 12;

function Profile() {
  const { user } = useAuth();
  const userId = user?._id ?? user?.id;

  const [profile, setProfile] = useState(() => ({
    ...startingProfile,
    name: user?.displayName || user?.username || startingProfile.name,
    username: user?.username || startingProfile.username,
    bio: user?.bio ?? "",
    avatarUrl: user?.avatarUrl ?? "",
    joinedAt: dayjs(user.createdAt).format("MMMM YYYY") ?? "",
  }));

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [postsPage, setPostsPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);
  const [openPostMenuId, setOpenPostMenuId] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [postsError, setPostsError] = useState("");

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  useEffect(() => {
    let isCurrent = true;

    const loadMyPosts = async () => {
      if (!userId) {
        setPosts([]);
        setPostCount(0);
        setIsPostsLoading(false);
        return;
      }

      setIsPostsLoading(true);
      setPostsError("");

      try {
        const response = await api.get("/posts/me", {
          params: { page: 1, limit: POSTS_PER_PAGE },
        });
        const data = response.data?.data;

        if (isCurrent) {
          setPosts(data?.posts ?? []);
          setPostCount(data?.pagination?.totalPosts ?? 0);
          setPostsPage(data?.pagination?.page ?? 1);
          setHasMorePosts(
            (data?.pagination?.page ?? 1) < (data?.pagination?.totalPages ?? 1),
          );
        }
      } catch (error) {
        if (isCurrent) {
          setPostsError(
            error.response?.data?.message ?? "Unable to load your posts.",
          );
        }
      } finally {
        if (isCurrent) setIsPostsLoading(false);
      }
    };

    loadMyPosts();
    return () => {
      isCurrent = false;
    };
  }, [userId]);

  async function handleLoadMorePosts() {
    if (isLoadingMorePosts || !hasMorePosts) return;

    const nextPage = postsPage + 1;
    setIsLoadingMorePosts(true);
    setPostsError("");

    try {
      const response = await api.get("/posts/me", {
        params: { page: nextPage, limit: POSTS_PER_PAGE },
      });
      const data = response.data?.data;
      setPosts((currentPosts) => [...currentPosts, ...(data?.posts ?? [])]);
      setPostCount(data?.pagination?.totalPosts ?? postCount);
      setPostsPage(data?.pagination?.page ?? nextPage);
      setHasMorePosts(
        (data?.pagination?.page ?? nextPage) <
          (data?.pagination?.totalPages ?? nextPage),
      );
    } catch (error) {
      setPostsError(
        error.response?.data?.message ?? "Unable to load more posts.",
      );
    } finally {
      setIsLoadingMorePosts(false);
    }
  }

  async function handleDeletePost(post) {
    setOpenPostMenuId(null);

    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone.",
    );
    if (!confirmed) return;

    setOpenPostMenuId(post._id);
    setDeletingPostId(post._id);

    try {
      await api.delete(`/posts/${post._id}`);
      setPosts((currentPosts) =>
        currentPosts.filter((currentPost) => currentPost._id !== post._id),
      );
      setPostCount((currentCount) => Math.max(0, currentCount - 1));
      toast.success("Post deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Unable to delete this post.");
    } finally {
      setDeletingPostId(null);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
    setSavedMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSavedMessage("");

    try {
      const formData = new FormData();
      formData.append("displayName", profile.name);
      formData.append("username", profile.username);
      formData.append("bio", profile.bio);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await api.patch("/users/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = response.data.data;

      setProfile((current) => ({
        ...current,
        name: updatedUser.displayName ?? current.name,
        username: updatedUser.username ?? current.username,
        bio: updatedUser.bio ?? current.bio,
        avatarUrl: updatedUser.avatarUrl ?? current.avatarUrl,
      }));

      setAvatarFile(null);
      setAvatarPreview("");
      setSavedMessage("Profile updated successfully.");
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message);
      setErrorMessage(
        error.response?.data?.message ?? "Unable to update your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="profile-page">
      <main className="profile-content">
        <section className="profile-hero" aria-label="Profile summary">
          <div className="cover-photo">
            <span className="active-badge">
              <span className="online-dot" /> Active Now
            </span>
          </div>

          <div className="profile-summary">
            <div className="avatar">
              {avatarPreview || profile.avatarUrl ? (
                <img
                  src={avatarPreview || profile.avatarUrl}
                  alt={`${profile.name}'s profile`}
                />
              ) : (
                profile.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="summary-details">
              <h1>
                {profile.name} <span className="verified">✓</span>
                {/* <span className="creator-badge">Pro Creator</span> */}
              </h1>
              <p className="username">@{profile.username}</p>
              <p className="summary-bio">{profile.bio}</p>
              <p className="summary-meta">
                <span>
                  {profile.joinedAt && `▣ Joined ${profile.joinedAt}`}
                </span>
              </p>
            </div>

            <div className="profile-stats">
              <div>
                <strong>{postCount}</strong>
                <span>Posts</span>
              </div>
              {/* <div>
                <strong>0</strong>
                <span>Followers</span>
              </div> */}
              {/* <div>
                <strong>0</strong>
                <span>Following</span>
              </div> */}
            </div>
          </div>
        </section>

        <section className="profile-body">
          <form className="profile-card" onSubmit={handleSubmit}>
            <div className="card-heading">
              <div>
                <h2>Profile Information</h2>
                <p>Update your account details and public persona.</p>
              </div>
              <span className="edit-label">Edit</span>
            </div>
            <label>
              Profile photo
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setAvatarFile(file);
                  setAvatarPreview(file ? URL.createObjectURL(file) : "");
                }}
              />
            </label>
            <label>
              Display Name
              <input name="name" value={profile.name} onChange={handleChange} />
            </label>

            <label>
              Username / Handle
              <input
                name="username"
                value={profile.username}
                onChange={handleChange}
              />
            </label>

            <label>
              Bio
              <textarea
                name="bio"
                rows="3"
                maxLength="160"
                value={profile.bio}
                onChange={handleChange}
              />
              <span className="character-count">
                {profile.bio.length} / 160
              </span>
            </label>

            {/* <div className="security-note">
              <span className="security-icon">✓</span>
              <span>
                <strong>Two-Factor Authentication</strong>
                <br />
                Enabled via Authenticator App
              </span>
            </div> */}

            <div className="form-actions">
              <button
                className="button button-light"
                type="button"
                onClick={() => {
                  setProfile({
                    ...startingProfile,
                    name:
                      user?.displayName ||
                      user?.username ||
                      startingProfile.name,
                    username: user?.username || startingProfile.username,
                    bio: user?.bio ?? "",
                    avatarUrl: user?.avatarUrl ?? "",
                  });
                  setAvatarFile(null);
                  setAvatarPreview("");
                  setSavedMessage("");
                  setErrorMessage("");
                }}
              >
                Cancel
              </button>
              <button
                className="button button-primary"
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "✓ Save Changes"}
              </button>
            </div>

            {savedMessage && <p role="status">{savedMessage}</p>}

            {errorMessage && (
              <p className="error-message" role="alert">
                {errorMessage}
              </p>
            )}
          </form>

          <section className="posts-section">
            <div className="posts-toolbar">
              <button className="tab-active" type="button">
                ▦ Posts <span>{postCount}</span>
              </button>
              {/* <button type="button">♡ Liked Posts</button> */}
              {/* <button type="button">♧ Saved</button> */}
              <span className="sort-label">Sorted by Latest</span>
            </div>

            {isPostsLoading ? (
              <p className="posts-feedback" role="status">
                Loading your posts…
              </p>
            ) : postsError ? (
              <p className="posts-feedback posts-feedback-error" role="alert">
                {postsError}
              </p>
            ) : posts.length === 0 ? (
              <p className="posts-feedback">
                You haven’t shared any posts yet.
              </p>
            ) : (
              <div className="post-grid">
                {posts.map((post) => (
                  <div className="profile-post-item" key={post._id}>
                    <Link
                      aria-label={`Post: ${post.content}`}
                      className="profile-post"
                      to={`/posts/${post._id}`}
                    >
                      {post.images?.[0] ? (
                        <img
                          src={post.images[0]}
                          alt={post.content || "Your post"}
                        />
                      ) : (
                        <span className="profile-post-text">{post.content}</span>
                      )}
                    </Link>

                    <button
                      aria-expanded={openPostMenuId === post._id}
                      aria-label={`More options for post: ${post.content}`}
                      className="profile-post-menu-button"
                      disabled={Boolean(deletingPostId)}
                      onClick={() =>
                        setOpenPostMenuId((currentId) =>
                          currentId === post._id ? null : post._id,
                        )
                      }
                      type="button"
                    >
                      <span aria-hidden="true">⋯</span>
                    </button>

                    {openPostMenuId === post._id && (
                      <div className="profile-post-menu">
                        <button
                          className="profile-post-delete-button"
                          disabled={Boolean(deletingPostId)}
                          onClick={() => handleDeletePost(post)}
                          type="button"
                        >
                          {deletingPostId === post._id
                            ? "Deleting…"
                            : "Delete post"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {postsError && !isPostsLoading && posts.length > 0 && (
              <p className="posts-feedback posts-feedback-error" role="alert">
                {postsError}
              </p>
            )}

            {hasMorePosts && (
              <button
                className="archive-button"
                disabled={isLoadingMorePosts}
                onClick={handleLoadMorePosts}
                type="button"
              >
                {isLoadingMorePosts ? "Loading…" : "View More Posts⌄"}
              </button>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default Profile;
