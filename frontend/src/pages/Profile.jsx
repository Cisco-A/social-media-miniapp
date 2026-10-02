import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const startingProfile = {
  name: "Alex Morgan",
  username: "alexmorgan",
  bio: "Product designer and photographer based in San Francisco. Building simple tools for curious minds ✨",
  avatarUrl: "",
};

const posts = [
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700",
    alt: "Modern building",
  },
  {
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700",
    alt: "Coffee and notebook",
  },
  {
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=700",
    alt: "Forest path",
  },
  {
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700",
    alt: "Colorful technology",
  },
  {
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=700",
    alt: "City at sunset",
  },
  {
    image: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=700",
    alt: "Handmade ceramics",
  },
];

function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(() => ({
    ...startingProfile,
    name: user?.displayName || user?.username || startingProfile.name,
    username: user?.username || startingProfile.username,
    bio: user?.bio ?? "",
    avatarUrl: user?.avatarUrl ?? "",
  }));

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

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
    } catch (error) {
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
                <span className="creator-badge">Pro Creator</span>
              </h1>
              <p className="username">@{profile.username}</p>
              <p className="summary-bio">{profile.bio}</p>
              <p className="summary-meta">
                <span>▣ Joined March 2022</span>
              </p>
            </div>

            <div className="profile-stats">
              <div>
                <strong>18</strong>
                <span>Posts</span>
              </div>
              <div>
                <strong>1,420</strong>
                <span>Followers</span>
              </div>
              <div>
                <strong>389</strong>
                <span>Following</span>
              </div>
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

            <div className="security-note">
              <span className="security-icon">✓</span>
              <span>
                <strong>Two-Factor Authentication</strong>
                <br />
                Enabled via Authenticator App
              </span>
            </div>

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
                ▦ Posts <span>18</span>
              </button>
              <button type="button">♡ Liked Posts</button>
              <button type="button">♧ Saved</button>
              <span className="sort-label">Sorted by Latest</span>
            </div>

            <div className="post-grid">
              {posts.map((post) => (
                <img key={post.alt} src={post.image} alt={post.alt} />
              ))}
            </div>

            <button className="archive-button" type="button">
              View More Archives⌄
            </button>
          </section>
        </section>
      </main>
    </div>
  );
}

export default Profile;
