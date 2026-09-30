import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

const navUrls = [
  {
    id: 1,
    path: "/posts",
    label: "Feed",
  },
  {
    id: 2,
    path: "/posts/create",
    label: "Create Post",
  },
  {
    id: 3,
    path: "/profile",
    label: "Profile",
  },
];

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();
  const currentPathname = location.pathname;
  return (
    <header className="topbar">
      <a className="brand" href="/">
        <img
          className="brand-logo"
          src={`${frontendUrl}/mingle-logo.svg`}
          alt="Mingle app logo"
        />
      </a>

      <nav className="main-nav" aria-label="Main navigation">
        {navUrls.map((nav) => (
          <Link
            className={`${currentPathname === nav.path && "nav-active"}`}
            key={nav.id}
            to={nav.path}
          >
            {nav.label}
          </Link>
        ))}
      </nav>

      <div className="topbar-user">
        {user?.displayName}{" "}
        <span className="small-avatar">
          {user?.displayName.charAt(0).toUpperCase()}
        </span>
      </div>
    </header>
  );
};

export default Header;
