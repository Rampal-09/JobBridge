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
    const isCurrent =
      path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    return isCurrent
      ? "relative text-indigo-600 font-bold px-3 py-1.5 rounded-xl bg-indigo-50/70 shadow-xs transition-all duration-200"
      : "relative text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all duration-200";
  };

  const isMobileActive = (path) => {
    const isCurrent =
      path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    return isCurrent
      ? "bg-indigo-50/80 text-indigo-700 font-semibold"
      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600";
  };

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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 text-white font-black shadow-md shadow-indigo-200/50 group-hover:scale-105 transition-all duration-300">
            JB
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent group-hover:opacity-95 transition-opacity duration-300">
            JobBridge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
          <Link to="/jobs" className={isActive("/jobs")}>
            Find Jobs
          </Link>

          {user?.role === "candidate" && (
            <>
              <Link to="/favorite" className={isActive("/favorite")}>
                Saved Jobs
              </Link>
              <Link to="/applied" className={isActive("/applied")}>
                Applied Jobs
              </Link>
            </>
          )}

          {user?.role === "recruiter" && (
            <Link to="/create-job" className={isActive("/create-job")}>
              Post a Job
            </Link>
          )}
        </nav>

        {/* User profile dropdown and actions / Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/profile/detail"
                className="flex items-center gap-2.5 rounded-full p-1 pr-3.5 hover:bg-slate-100/80 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs shadow-xs">
                  {getInitials(user.name)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize leading-none mt-0.5">
                    {user.role}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 hover:border-red-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50/50 transition-all duration-200 cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signUp"
                className="inline-flex items-center justify-center text-xs font-bold px-4 py-2.5 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-100 hover:shadow-lg transition-all duration-200"
              >
                Sign Up / Join
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger / Profile button */}
        <div className="md:hidden flex items-center gap-2">
          {user ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm border transition-all duration-200 cursor-pointer outline-none ${
                isOpen
                  ? "ring-2 ring-indigo-500/50 scale-105 border-indigo-300"
                  : "border-indigo-200 hover:scale-105"
              }`}
              aria-label="Toggle navigation"
            >
              {getInitials(user.name)}
            </button>
          ) : (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="border-t border-slate-200/70 bg-white px-4 py-4 md:hidden space-y-2 shadow-inner animate-slide-down">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`block rounded-xl px-3 py-2 text-sm font-medium ${isMobileActive("/")}`}
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={() => setIsOpen(false)}
            className={`block rounded-xl px-3 py-2 text-sm font-medium ${isMobileActive("/jobs")}`}
          >
            Find Jobs
          </Link>

          {user?.role === "candidate" && (
            <>
              <Link
                to="/favorite"
                onClick={() => setIsOpen(false)}
                className={`block rounded-xl px-3 py-2 text-sm font-medium ${isMobileActive("/favorite")}`}
              >
                Saved Jobs
              </Link>
              <Link
                to="/applied"
                onClick={() => setIsOpen(false)}
                className={`block rounded-xl px-3 py-2 text-sm font-medium ${isMobileActive("/applied")}`}
              >
                Applied Jobs
              </Link>
            </>
          )}

          {user?.role === "recruiter" && (
            <Link
              to="/create-job"
              onClick={() => setIsOpen(false)}
              className={`block rounded-xl px-3 py-2 text-sm font-medium ${isMobileActive("/create-job")}`}
            >
              Post a Job
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile/detail"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
              >
                My Profile ({user.name})
              </Link>

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left block rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/signUp"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
