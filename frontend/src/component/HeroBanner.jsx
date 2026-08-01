import React from "react";

const HeroBanner = ({ searchVal = "", onSearchChange, user }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/30 p-6 md:p-8 border border-slate-200/60 shadow-sm shadow-indigo-50/20 mb-6">
      {/* Soft background glow decoration */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-100/30 blur-3xl"></div>
      <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-purple-100/20 blur-3xl"></div>

      {/* Floating Illustration / Graphic (Hidden on mobile/tablet, shown on lg+) */}
      <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 w-80 h-48 items-center justify-center pointer-events-auto">
        {/* Decorative background glow circles */}
        <div className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-indigo-500/5 to-purple-500/5 animate-pulse"></div>
        
        {/* Card 1: CV Verified */}
        <div className="absolute left-0 top-4 bg-white/95 backdrop-blur-md border border-slate-200/60 p-3 rounded-2xl shadow-lg hover:scale-105 hover:rotate-0 hover:z-20 transition-all duration-300 cursor-default animate-float-1 hover:[animation-play-state:paused] flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-lg shadow-sm border border-indigo-100/50">
            📄
          </div>
          <div className="text-left">
            <span className="inline-block text-[9px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100/50 px-2 py-0.5 rounded-full uppercase tracking-wider leading-none">
              CV Verified
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1">resume_developer.pdf</p>
          </div>
        </div>

        {/* Card 2: Smart Match */}
        <div className="absolute right-0 bottom-4 bg-white/95 backdrop-blur-md border border-slate-200/60 p-3 rounded-2xl shadow-lg hover:scale-105 hover:rotate-0 hover:z-20 transition-all duration-300 cursor-default animate-float-2 hover:[animation-play-state:paused] flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-lg shadow-sm border border-purple-100/50">
            ✨
          </div>
          <div className="text-left">
            <span className="inline-block text-[9px] font-extrabold bg-purple-50 text-purple-700 border border-purple-100/50 px-2 py-0.5 rounded-full uppercase tracking-wider leading-none">
              Smart Match
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1">98% Match Score</p>
          </div>
        </div>

        {/* Card 3: Job Applied */}
        <div className="absolute top-2 right-4 bg-white/95 backdrop-blur-md border border-slate-200/60 p-2.5 rounded-xl shadow-md hover:scale-105 hover:rotate-0 hover:z-20 transition-all duration-300 cursor-default animate-float-3 hover:[animation-play-state:paused] flex items-center gap-2">
          <span className="text-xs">🚀</span>
          <span className="text-[10px] font-bold text-slate-700">Applied</span>
          <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-1.5 py-0.5 rounded-full uppercase leading-none">
            Success
          </span>
        </div>
      </div>

      <div className="relative space-y-4 max-w-xl lg:max-w-[55%] xl:max-w-2xl pr-0 lg:pr-12 text-left">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100/50">
          Welcome back, {user?.name || "Job Seeker"} 👋
        </span>
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Find your next{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              dream career
            </span>
          </h1>
          <p className="text-slate-500 text-xs md:text-sm lg:text-base max-w-lg leading-relaxed">
            Explore opportunities from fast-growing startups to enterprise leaders. Filter by location, job type, and find your bridge to success.
          </p>
        </div>

        {/* Quick Search Input */}
        <div className="relative max-w-xl pt-2 group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 pt-2">
            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search job titles, skills, or companies..."
            value={searchVal}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 pl-11 pr-24 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 focus:bg-white transition-all bg-slate-50/50 shadow-inner"
          />
          
          {/* Embedded Action buttons inside input */}
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pt-2">
            {searchVal && (
              <button
                onClick={() => onSearchChange("")}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Clear search"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 shadow-md shadow-indigo-100 hover:shadow-indigo-200/50 cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        {/* Quick Category Selector Pills */}
        <div className="space-y-2 pt-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {["React", "Node.js", "Java", "Python", "Full Stack", "Frontend", "Backend", "Remote"].map((category) => {
              const isActive = searchVal?.toLowerCase() === category.toLowerCase();
              return (
                <button
                  key={category}
                  onClick={() => onSearchChange(isActive ? "" : category)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100 scale-105"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-indigo-50/20 hover:text-indigo-600 hover:border-indigo-200 hover:-translate-y-0.5 hover:shadow-sm"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
