import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { LogOutIcon, AlertTriangle, X } from "lucide-react";

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
  const { user, logout } = useAuth();
  const currentPathname = location.pathname;

  // State to control modal visibility
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Show the modal when user clicks logout button
  function handleLogoutClick() {
    setIsLogoutModalOpen(true);
  }

  // Hide the modal
  function handleCancelLogout() {
    setIsLogoutModalOpen(false);
  }

  // Execute logout logic and hide modal
  function confirmLogout() {
    setIsLogoutModalOpen(false);
    logout();
  }

  return (
    <>
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
              className={`${currentPathname === nav.path ? "nav-active" : ""}`}
              key={nav.id}
              to={nav.path}
            >
              {nav.label}
            </Link>
          ))}
        </nav>

        <div className="topbar-user">
          {user?.displayName}{" "}
          {user?.avatarUrl ? (
            <img
              className="rounded-full h-10 w-10 border border-slate-300 shadow-sm shadow-slate-200"
              src={user.avatarUrl}
              alt={`${user.displayName} avatar image`}
            />
          ) : (
            <span className="small-avatar">
              {user?.displayName?.charAt(0).toUpperCase() || ""}
            </span>
          )}
          <button
            onClick={handleLogoutClick}
            title="Log out"
            type="button"
            className="p-2 hover:bg-red-100 rounded-full duration-300 transition-all cursor-pointer outline-none border-none bg-transparent"
          >
            <LogOutIcon size={18} className="text-red-500" />
          </button>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Icon Button */}
            <button
              onClick={handleCancelLogout}
              type="button"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Header / Icon */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Confirm Logout
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to log out of your account?
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancelLogout}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-200 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
