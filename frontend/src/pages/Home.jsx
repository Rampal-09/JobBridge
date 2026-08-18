import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getJobs } from "../api/job";
import JobCard from "./JobCard";
import SkeletonCard from "../component/SkeletonCard";
import Layout from "../component/Layout";

const Home = ({
  favoriteJobIds = [],
  applyJobIds = [],
  onFavorite,
  handleApply,
  onEditing,
  onDeleteJob,
}) => {
  const navigate = useNavigate();

  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Search state for Hero
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  useEffect(() => {
    const fetchLatestJobs = async () => {
      setIsLoading(true);
      try {
        const res = await getJobs({ limit: 6, sortBy: "createdAt", order: "desc" });
        setFeaturedJobs(res.jobs || []);
        setTotalJobsCount(res.totalJobs || 0);
      } catch (err) {
        console.error("Failed to load featured jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestJobs();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (locationQuery.trim()) params.set("location", locationQuery.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleQuickTagClick = (tag) => {
    if (tag.toLowerCase() === "remote") {
      navigate("/jobs?type=remote");
    } else if (tag.toLowerCase() === "internship") {
      navigate("/jobs?type=Internship");
    } else {
      navigate(`/jobs?search=${encodeURIComponent(tag)}`);
    }
  };

  const categories = [
    {
      title: "Frontend Development",
      icon: "💻",
      query: "Frontend",
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600",
      description: "React, Vue, TypeScript & UI",
    },
    {
      title: "Backend Development",
      icon: "⚙️",
      query: "Backend",
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600",
      description: "Node.js, Python, Java & APIs",
    },
    {
      title: "Full Stack Engineering",
      icon: "🚀",
      query: "Full Stack",
      color: "from-purple-500/10 to-violet-500/10 text-purple-600",
      description: "End-to-end web & mobile apps",
    },
    {
      title: "Python & Data / AI",
      icon: "🐍",
      query: "Python",
      color: "from-amber-500/10 to-orange-500/10 text-amber-600",
      description: "FastAPI, Django, Data & ML",
    },
    {
      title: "Remote Opportunities",
      icon: "🌐",
      type: "remote",
      color: "from-sky-500/10 to-blue-500/10 text-sky-600",
      description: "Work from anywhere in the world",
    },
    {
      title: "Internships & Entry",
      icon: "🎓",
      type: "Internship",
      color: "from-pink-500/10 to-rose-500/10 text-pink-600",
      description: "Start your tech career journey",
    },
  ];

  return (
    <Layout fullWidth={true}>
      {/* 1. HERO SECTION WITH PASTEL BACKGROUND */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F2] via-[#F8F5FF] to-[#EDF5FF] pt-8 pb-16 md:pt-16 md:pb-24 border-b border-slate-200/60">
        {/* Soft Ambient Background Blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl"></div>
        <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Messaging & Search Box */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200/80 px-3.5 py-1.5 shadow-xs backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-700">
                  {totalJobsCount > 0
                    ? `${totalJobsCount} Verified Jobs Available Live`
                    : "Smart Career Platform"}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Find a Job That Moves Your{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Career Forward
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Discover authentic job opportunities tailored to your skills, experience level, and salary expectations. Apply with one click using your verified resume.
              </p>

              {/* Dual-field Integrated Search Bar */}
              <form
                onSubmit={handleHeroSearch}
                className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 p-2 sm:p-3 shadow-xl shadow-indigo-100/40 flex flex-col sm:flex-row items-stretch gap-2.5 max-w-2xl"
              >
                {/* Keyword Field */}
                <div className="relative flex-1 flex items-center">
                  <span className="absolute left-3.5 text-slate-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Job title, skill, or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent pl-11 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
                  />
                </div>

                {/* Divider on desktop */}
                <div className="hidden sm:block w-px bg-slate-200 my-1"></div>

                {/* Location Field */}
                <div className="relative flex-1 flex items-center">
                  <span className="absolute left-3.5 text-slate-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Location or Remote"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full bg-transparent pl-11 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold px-6 py-3 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-md shadow-indigo-200/50 hover:shadow-indigo-300 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Search Jobs</span>
                </button>
              </form>

              {/* Popular Quick Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                <span className="font-bold text-slate-400 mr-1 uppercase tracking-wider">
                  Popular:
                </span>
                {["React", "Node.js", "Python", "Full Stack", "Remote", "Internship"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleQuickTagClick(tag)}
                    className="bg-white/80 hover:bg-white text-slate-700 hover:text-indigo-600 font-semibold px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Floating Visual Cards (Inspired by Reference) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md h-80 sm:h-96 flex items-center justify-center">
                {/* Center Core Badge */}
                <div className="relative z-10 w-64 p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl shadow-indigo-100 text-center space-y-3">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-200">
                    JB
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Smart Match Engine
                  </h3>
                  <p className="text-xs text-slate-500">
                    Connecting candidates directly to active openings with zero intermediaries.
                  </p>
                  <Link
                    to="/jobs"
                    className="inline-block w-full py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
                  >
                    Explore Openings →
                  </Link>
                </div>

                {/* Floating Card 1: Resume Attached */}
                <div className="absolute top-2 left-0 sm:-left-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/80 p-3 rounded-2xl shadow-lg animate-float-1 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg border border-emerald-100/60">
                    📄
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Resume Ready
                    </span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">1-Click Fast Apply</p>
                  </div>
                </div>

                {/* Floating Card 2: Real-time Status */}
                <div className="absolute bottom-4 right-0 sm:-right-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/80 p-3 rounded-2xl shadow-lg animate-float-2 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg border border-indigo-100/60">
                    ✨
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Status Live
                    </span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">Application Tracked</p>
                  </div>
                </div>

                {/* Floating Card 3: Top Openings */}
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-md border border-slate-200/80 px-3 py-2 rounded-xl shadow-md animate-float-3 flex items-center gap-2">
                  <span className="text-xs">🚀</span>
                  <span className="text-[11px] font-bold text-slate-700">Verified Recruiters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL METRICS BAR (Direct from DB counts & Platform Features) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl shadow-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100 *:pt-4 lg:*:pt-0 first:*:pt-0">
          <div className="flex flex-col items-center justify-center space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              {totalJobsCount > 0 ? totalJobsCount : "Live"}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Active Job Openings
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 font-display">
              100%
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Verified Postings
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-violet-600 font-display">
              1-Click
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Direct Application
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-pink-600 font-display">
              Real-Time
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Application Tracker
            </span>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE JOB CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Explore Roles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-display">
              Popular Job Categories
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Select a category to view active listings matching your domain.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
          >
            <span>View All Jobs</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.title}
              onClick={() => {
                if (cat.type) {
                  navigate(`/jobs?type=${cat.type}`);
                } else {
                  navigate(`/jobs?search=${encodeURIComponent(cat.query)}`);
                }
              }}
              className="text-left bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200 hover:shadow-indigo-50/50 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <span className="text-slate-400 group-hover:text-indigo-600 transition-colors text-lg">
                  →
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors font-display">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {cat.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. FEATURED OPPORTUNITIES (Real Latest Database Jobs) */}
      <section className="bg-slate-100/60 py-16 sm:py-24 border-y border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
              Latest Openings
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              Featured Opportunities
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Explore the newest authentic positions posted directly by verified recruiters on JobBridge.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
              <p className="text-base font-bold text-slate-800">No jobs posted yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Be the first to post a new opening!
              </p>
              <Link
                to="/create-job"
                className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {featuredJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isFavorite={favoriteJobIds.includes(job._id)}
                    isApplied={applyJobIds.includes(job._id)}
                    onFavorite={onFavorite}
                    handleApply={handleApply}
                    onEditing={onEditing}
                    onDeleteJob={onDeleteJob}
                  />
                ))}
              </div>

              {/* Centered CTA */}
              <div className="text-center pt-4">
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200/50 hover:shadow-lg transition-all active:scale-98"
                >
                  <span>Explore All {totalJobsCount > 0 ? `${totalJobsCount} ` : ""}Jobs</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. HOW JOBBRIDGE WORKS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            How JobBridge Works
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            A straightforward process designed to help you land your next role with zero friction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {[
            {
              step: "01",
              title: "Create Your Profile",
              desc: "Build your professional profile and upload your resume once.",
              icon: "👤",
            },
            {
              step: "02",
              title: "Find Matching Roles",
              desc: "Search by skills, location, job type, and salary range.",
              icon: "🔍",
            },
            {
              step: "03",
              title: "1-Click Smart Apply",
              desc: "Submit your application directly to the recruiter with your resume.",
              icon: "⚡",
            },
            {
              step: "04",
              title: "Track Application",
              desc: "Monitor your application status live from applied to hired.",
              icon: "🎯",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-indigo-600 font-display">
                  {item.step}
                </span>
                <span className="text-2xl p-2 rounded-2xl bg-indigo-50/70 border border-indigo-100/50">
                  {item.icon}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY JOBBRIDGE (Platform Advantages) */}
      <section className="bg-white py-16 sm:py-24 border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                Why JobBridge
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight font-display">
                Built for Developers and Tech Recruiters
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                JobBridge simplifies the hiring pipeline by eliminating unnecessary intermediaries. Direct connections, verified jobs, and honest salary ranges.
              </p>

              <div className="pt-2">
                <Link
                  to="/signUp"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md active:scale-98"
                >
                  Join JobBridge Free →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Direct Recruiter Delivery",
                  desc: "Your application goes straight to the hiring manager with no lost emails.",
                  icon: "📬",
                },
                {
                  title: "Transparent Salaries",
                  desc: "Clear compensation data visible before you apply.",
                  icon: "💎",
                },
                {
                  title: "Saved Job Bookmarks",
                  desc: "Bookmark roles and apply whenever you are ready.",
                  icon: "🔖",
                },
                {
                  title: "Dedicated Recruiter Tools",
                  desc: "Post, edit, manage, and review applicant resumes in one dashboard.",
                  icon: "📊",
                },
              ].map((adv) => (
                <div
                  key={adv.title}
                  className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/70 space-y-3"
                >
                  <span className="text-2xl">{adv.icon}</span>
                  <h4 className="text-sm font-bold text-slate-900 font-display">
                    {adv.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL HIGH-IMPACT CALL TO ACTION (WITH PASTEL HERO BACKGROUND) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFF5F2] via-[#F8F5FF] to-[#EDF5FF] p-8 sm:p-12 md:p-16 text-center border border-slate-200/80 shadow-xl shadow-indigo-100/30">
          {/* Ambient Background Blobs matching Hero */}
          <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl"></div>
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"></div>
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200/80 px-3.5 py-1.5 shadow-2xs backdrop-blur-sm mx-auto">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-700">
                Start Your Journey Today
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight font-display">
              Ready to Advance Your{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Tech Career?
              </span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Explore open positions or post an opening to reach qualified candidates today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/jobs"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-md shadow-indigo-200/50 hover:shadow-lg transition-all active:scale-98"
              >
                Browse All Openings
              </Link>
              <Link
                to="/create-job"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 font-bold text-sm shadow-xs transition-all active:scale-98"
              >
                Post a Job Opening
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
