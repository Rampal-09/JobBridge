import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 mt-auto">
      {/* Top Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 text-white font-black shadow-md shadow-indigo-200/50 group-hover:scale-105 transition-transform duration-300">
                JB
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                JobBridge
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Bridging talented professionals with fast-growing companies. Discover authentic job opportunities, apply seamlessly with your resume, and track your applications in real-time.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/60">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Database
              </span>
              <span>100% Verified Listings</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">
              For Candidates
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/jobs" className="hover:text-indigo-600 transition-colors">
                  Explore All Jobs
                </Link>
              </li>
              <li>
                <Link to="/favorite" className="hover:text-indigo-600 transition-colors">
                  Saved Jobs
                </Link>
              </li>
              <li>
                <Link to="/applied" className="hover:text-indigo-600 transition-colors">
                  Application Status
                </Link>
              </li>
              <li>
                <Link to="/profile/detail" className="hover:text-indigo-600 transition-colors">
                  Resume & Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Role Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">
              Top Categories
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/jobs?search=React" className="hover:text-indigo-600 transition-colors">
                  React & Frontend
                </Link>
              </li>
              <li>
                <Link to="/jobs?search=Node" className="hover:text-indigo-600 transition-colors">
                  Node.js & Backend
                </Link>
              </li>
              <li>
                <Link to="/jobs?search=Python" className="hover:text-indigo-600 transition-colors">
                  Python & AI
                </Link>
              </li>
              <li>
                <Link to="/jobs?type=remote" className="hover:text-indigo-600 transition-colors">
                  Remote Positions
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruiters / Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">
              For Employers
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/create-job" className="hover:text-indigo-600 transition-colors">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link to="/signUp" className="hover:text-indigo-600 transition-colors">
                  Recruiter Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-600 transition-colors">
                  Employer Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} JobBridge. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/jobs" className="hover:text-slate-600 transition-colors">
              Find Jobs
            </Link>
            <Link to="/login" className="hover:text-slate-600 transition-colors">
              Account
            </Link>
            <span>Real-time Live Listings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
