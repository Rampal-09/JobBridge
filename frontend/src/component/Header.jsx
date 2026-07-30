import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Context";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "relative text-indigo-600 font-bold px-3 py-1.5 rounded-xl bg-indigo-50/50 shadow-sm transition-all duration-300"
      : "relative text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all duration-300";
  };

  const isMobileActive = (path) => {
    return location.pathname === path
      ? "bg-indigo-50/80 text-indigo-700 font-semibold"
      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600";
  };

  if (!user) return null;

  // Initials for avatar badge
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 text-white font-black shadow-lg shadow-indigo-200/50 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
            JB
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity duration-300">
            JobBridge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Link to="/" className={isActive("/")}>
            Browse Jobs
          </Link>

          {user.role === "candidate" && (
            <>
              <Link to="/favorite" className={isActive("/favorite")}>
                Saved Jobs
              </Link>
              <Link to="/applied" className={isActive("/applied")}>
                Applied Jobs
              </Link>
            </>
          )}

          {user.role === "recruiter" && (
            <Link to="/create-job" className={isActive("/create-job")}>
              Post a Job
            </Link>
          )}
        </nav>

        {/* User profile dropdown and actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/profile/detail"
            className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
              {getInitials(user.name)}
            </div>
            <span className="text-xs font-semibold text-slate-800 leading-none">
              {user.name}
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-200 hover:border-red-200 px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50/30 transition-all duration-200 cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile Profile Avatar button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm border transition-all duration-300 md:hidden cursor-pointer outline-none ${
            isOpen
              ? "ring-2 ring-indigo-500/50 scale-105 border-indigo-300 shadow-inner"
              : "border-indigo-200 hover:scale-105 shadow-sm"
          }`}
          aria-label="Toggle profile navigation"
        >
          {getInitials(user.name)}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="border-t border-slate-200/60 bg-white px-4 py-3 md:hidden space-y-2 shadow-inner animate-slide-down">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`block rounded-lg px-3 py-2 text-sm font-medium ${isMobileActive("/")}`}
          >
            Browse Jobs
          </Link>

          {user.role === "candidate" && (
            <>
              <Link
                to="/favorite"
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${isMobileActive("/favorite")}`}
              >
                Saved Jobs
              </Link>
              <Link
                to="/applied"
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${isMobileActive("/applied")}`}
              >
                Applied Jobs
              </Link>
            </>
          )}

          {user.role === "recruiter" && (
            <Link
              to="/create-job"
              onClick={() => setIsOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm font-medium ${isMobileActive("/create-job")}`}
            >
              Post a Job
            </Link>
          )}

          <Link
            to="/profile/detail"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
          >
            My Profile
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left block rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
