import { useState } from "react";
import mingleLogo from "../assets/mingle-logo.svg";

const startingProfile = {
  name: "Alex Morgan",
  username: "alexmorgan",
  bio: "Product designer and photographer based in San Francisco. Building simple tools for curious minds ✨",
  location: "San Francisco, CA",
  website: "alexmorgan.design",
};

const posts = [
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700",
    alt: "Modern building",
  },
  {
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700",
    alt: "Coffee and notebook",
  },
  {
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=700",
    alt: "Forest path",
  },
  {
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700",
    alt: "Colorful technology",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=700",
    alt: "City at sunset",
  },
  {
    image:
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=700",
    alt: "Handmade ceramics",
  },
];

function Profile() {
  const [profile, setProfile] = useState(startingProfile);
  const [savedMessage, setSavedMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
    setSavedMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSavedMessage("Your changes are saved on this page.");
  }

  return (
    <div className="profile-page">
      <header className="topbar">
        <a className="brand" href="/">
  <img className="brand-logo" src={mingleLogo} alt="Mingle" />
</a> 

        <nav className="main-nav" aria-label="Main navigation">
          <a href="/">Feed</a>
          <a href="/">Create Post</a>
          <a className="nav-active" href="/profile">
            Profile
          </a>
        </nav>

        <div className="topbar-user">
          Alex Morgan <span className="small-avatar">A</span>
        </div>
      </header>

      <main className="profile-content">
        <section className="profile-hero" aria-label="Profile summary">
          <div className="cover-photo">
            <span className="active-badge">
              <span className="online-dot" /> Active Now
            </span>
          </div>

          <div className="profile-summary">
            <div className="avatar">A</div>

            <div className="summary-details">
              <h1>
                {profile.name} <span className="verified">✓</span>
                <span className="creator-badge">Pro Creator</span>
              </h1>
              <p className="username">@{profile.username}</p>
              <p className="summary-bio">{profile.bio}</p>
              <p className="summary-meta">
                <span>⌖ {profile.location}</span>
                <span>↗ {profile.website}</span>
                <span>▣ Joined March 2022</span>
              </p>
            </div>

            <div className="profile-stats">
              <div><strong>18</strong><span>Posts</span></div>
              <div><strong>1,420</strong><span>Followers</span></div>
              <div><strong>389</strong><span>Following</span></div>
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
              Display Name
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
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
              <span className="character-count">{profile.bio.length} / 160</span>
            </label>

            <div className="two-columns">
              <label>
                Location
                <input
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                />
              </label>

              <label>
                Website
                <input
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="security-note">
              <span className="security-icon">✓</span>
              <span><strong>Two-Factor Authentication</strong><br />Enabled via Authenticator App</span>
            </div>

            <div className="form-actions">
              <button
                className="button button-light"
                type="button"
                onClick={() => {
                  setProfile(startingProfile);
                  setSavedMessage("");
                }}
              >
                Cancel
              </button>
              <button className="button button-primary" type="submit">
                ✓ Save Changes
              </button>
            </div>

            {savedMessage && (
              <p className="saved-message" role="status">{savedMessage}</p>
            )}
          </form>

          <section className="posts-section">
            <div className="posts-toolbar">
              <button className="tab-active" type="button">▦ Posts <span>18</span></button>
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

      <footer className="page-footer">
        <span><strong>Mingle</strong> — Simple, calm social interactions.</span>
        <span>© 2026 Mingle Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default Profile;